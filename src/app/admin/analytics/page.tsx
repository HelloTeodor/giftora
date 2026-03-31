import { prisma } from '@/lib/prisma';
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import { AdminRevenueChart } from '@/components/admin/AdminRevenueChart';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics | Admin' };
export const dynamic = 'force-dynamic';

async function getAnalyticsData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    revenueThisMonth,
    revenueLastMonth,
    ordersThisMonth,
    ordersLastMonth,
    newCustomersThisMonth,
    newCustomersLastMonth,
    totalCustomers,
    topProducts,
    categories,
    orderStatusBreakdown,
    recentOrders,
    allPaidOrdersThisMonth,
    wishlistGrouped,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID', createdAt: { gte: thirtyDaysAgo } },
      _sum: { total: true }, _count: true, _avg: { total: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      _sum: { total: true }, _count: true, _avg: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.user.count(),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true, slug: true, soldCount: true, basePrice: true, salePrice: true, rating: true, reviewCount: true },
      orderBy: { soldCount: 'desc' },
      take: 8,
    }),
    prisma.category.findMany({
      include: { products: { select: { soldCount: true, basePrice: true, salePrice: true }, where: { status: 'ACTIVE' } } },
      take: 8,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { _count: { status: 'desc' } },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: {
        id: true, orderNumber: true, total: true, status: true, paymentStatus: true, createdAt: true,
        user: { select: { name: true, email: true } },
        items: { take: 1, select: { productName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    // All paid orders in last 30d for daily chart grouping
    prisma.order.findMany({
      where: { paymentStatus: 'PAID', createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.wishlistItem.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 5,
    }),
  ]);

  // Fetch product names for wishlist
  const wishlistProductIds = wishlistGrouped.map(w => w.productId);
  const wishlistProducts = wishlistProductIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: wishlistProductIds } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const wishlistProductMap = Object.fromEntries(wishlistProducts.map(p => [p.id, p]));
  const topWishlist = wishlistGrouped
    .map(w => ({ ...wishlistProductMap[w.productId], count: w._count.productId }))
    .filter(w => w.name);

  // Build daily revenue chart data (last 30 days)
  const dailyMap: Record<string, number> = {};
  allPaidOrdersThisMonth.forEach(o => {
    const key = o.createdAt.toISOString().split('T')[0];
    dailyMap[key] = (dailyMap[key] || 0) + Number(o.total);
  });
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    return { label, revenue: Math.round((dailyMap[key] || 0) * 100) / 100 };
  });

  // Category performance
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    productCount: cat.products.length,
    totalSold: cat.products.reduce((s, p) => s + p.soldCount, 0),
    estimatedRevenue: cat.products.reduce((s, p) => s + p.soldCount * Number(p.salePrice || p.basePrice), 0),
  })).sort((a, b) => b.totalSold - a.totalSold).slice(0, 6);

  return {
    revenueThisMonth, revenueLastMonth,
    ordersThisMonth, ordersLastMonth,
    newCustomersThisMonth, newCustomersLastMonth,
    totalCustomers,
    topProducts, categoryStats,
    orderStatusBreakdown, recentOrders,
    chartData, topWishlist,
  };
}

function ChangeTag({ change }: { change: number }) {
  if (change === 0) return <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Minus size={10} /> No change</p>;
  const up = change > 0;
  return (
    <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-500'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? '+' : ''}{change.toFixed(1)}% vs prev. 30d
    </p>
  );
}

function pct(a: number, b: number) {
  return b === 0 ? 0 : ((a - b) / b) * 100;
}

export default async function AdminAnalyticsPage() {
  const d = await getAnalyticsData();

  const revThis = Number(d.revenueThisMonth._sum.total || 0);
  const revLast = Number(d.revenueLastMonth._sum.total || 0);
  const aovThis = Number(d.revenueThisMonth._avg.total || 0);
  const aovLast = Number(d.revenueLastMonth._avg.total || 0);
  const totalOrders = d.ordersThisMonth;

  const kpis = [
    {
      label: 'Revenue (30d)',
      value: formatPrice(revThis),
      sub: `${d.revenueThisMonth._count} paid orders`,
      change: pct(revThis, revLast),
      color: 'bg-gold-50 text-gold-700',
    },
    {
      label: 'Orders (30d)',
      value: d.ordersThisMonth.toLocaleString(),
      sub: `${d.revenueThisMonth._count} paid`,
      change: pct(d.ordersThisMonth, d.ordersLastMonth),
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Avg. Order Value',
      value: formatPrice(aovThis),
      sub: 'paid orders only',
      change: pct(aovThis, aovLast),
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'New Customers (30d)',
      value: d.newCustomersThisMonth.toLocaleString(),
      sub: `${d.totalCustomers} total`,
      change: pct(d.newCustomersThisMonth, d.newCustomersLastMonth),
      color: 'bg-green-50 text-green-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time performance — last 30 days</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{kpi.label}</p>
            <p className="font-serif text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
            <ChangeTag change={kpi.change} />
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Daily Revenue</h2>
            <p className="text-sm text-gray-400 mt-0.5">Paid orders — last 30 days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 font-serif">{formatPrice(revThis)}</p>
            <ChangeTag change={pct(revThis, revLast)} />
          </div>
        </div>
        <AdminRevenueChart data={d.chartData} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Top Products by Sales</h2>
          {d.topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {d.topProducts.map((p, i) => {
                const price = Number(p.salePrice || p.basePrice);
                const estRevenue = p.soldCount * price;
                const maxSold = d.topProducts[0].soldCount || 1;
                return (
                  <div key={p.id}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="w-5 text-xs font-bold text-gray-300 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Link href={`/admin/products`} className="text-sm font-semibold text-gray-900 truncate hover:text-gold-600">{p.name}</Link>
                          <span className="text-sm font-bold text-gray-800 shrink-0">{p.soldCount} sold</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{formatPrice(price)} · est. {formatPrice(estRevenue)}</span>
                          {p.reviewCount > 0 && <span className="text-xs text-amber-500">{'★'.repeat(Math.round(Number(p.rating)))} ({p.reviewCount})</span>}
                        </div>
                      </div>
                    </div>
                    <div className="ml-8 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-gold-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${maxSold > 0 ? (p.soldCount / maxSold) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-gray-900">Order Breakdown</h2>
            <span className="text-sm text-gray-400">{totalOrders} total</span>
          </div>
          {d.orderStatusBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No orders in the last 30 days</p>
          ) : (
            <div className="space-y-4">
              {d.orderStatusBreakdown.map(({ status, _count }) => {
                const pctVal = totalOrders > 0 ? (_count / totalOrders) * 100 : 0;
                const colorClass = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                        {ORDER_STATUS_LABELS[status] || status}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{_count}</span>
                        <span className="text-xs text-gray-400 ml-1">({pctVal.toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gold-400 h-2 rounded-full transition-all"
                        style={{ width: `${pctVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Category Performance</h2>
          {d.categoryStats.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No categories yet</p>
          ) : (
            <div className="space-y-3">
              {d.categoryStats.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-xs font-bold text-gray-300 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 truncate">{cat.name}</span>
                      <span className="text-gray-500 shrink-0 ml-2">{cat.totalSold} sold</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{cat.productCount} products</span>
                      <span>est. {formatPrice(cat.estimatedRevenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Wishlisted */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Most Wishlisted</h2>
          {d.topWishlist.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No wishlist activity yet</p>
          ) : (
            <div className="space-y-3">
              {d.topWishlist.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-xs font-bold text-gray-300 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-pink-500 shrink-0">
                    <span>♥</span>
                    <span className="font-bold text-gray-700">{p.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-gold-600 hover:underline font-medium">View all →</Link>
        </div>
        {d.recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {d.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-semibold text-sm text-gray-900">#{order.orderNumber}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 hidden sm:table-cell">
                      {order.user?.name || order.user?.email || 'Guest'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400 hidden md:table-cell">
                      {order.createdAt.toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">{formatPrice(Number(order.total))}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs text-gold-600 hover:underline font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
