import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { AdminRevenueChart } from '@/components/admin/AdminRevenueChart';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics | Admin' };

async function getAnalyticsData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    revenueThisMonth, revenueLastMonth,
    ordersThisMonth, ordersLastMonth,
    topProducts, topCategories,
    conversionData
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: thirtyDaysAgo } }, _sum: { total: true }, _count: true, _avg: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }, _sum: { total: true }, _count: true, _avg: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { name: true, soldCount: true, basePrice: true, salePrice: true },
      orderBy: { soldCount: 'desc' },
      take: 10,
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { products: { _count: 'desc' } },
      take: 8,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  return { revenueThisMonth, revenueLastMonth, ordersThisMonth, ordersLastMonth, topProducts, topCategories, conversionData };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  const revenueThisMonth = Number(data.revenueThisMonth._sum.total || 0);
  const revenueLastMonth = Number(data.revenueLastMonth._sum.total || 0);
  const revenueChange = revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100) : 0;

  const aovThisMonth = Number(data.revenueThisMonth._avg.total || 0);
  const aovLastMonth = Number(data.revenueLastMonth._avg.total || 0);
  const aovChange = aovLastMonth > 0 ? ((aovThisMonth - aovLastMonth) / aovLastMonth * 100) : 0;

  const ordersChange = data.ordersLastMonth > 0 ? ((data.ordersThisMonth - data.ordersLastMonth) / data.ordersLastMonth * 100) : 0;

  const kpis = [
    { label: 'Revenue (30d)', value: formatPrice(revenueThisMonth), change: revenueChange },
    { label: 'Orders (30d)', value: data.ordersThisMonth.toLocaleString(), change: ordersChange },
    { label: 'Avg. Order Value', value: formatPrice(aovThisMonth), change: aovChange },
    { label: 'Paid Orders', value: data.revenueThisMonth._count.toLocaleString(), change: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Last 30 days performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-card">
            <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
            <p className="font-serif text-2xl font-bold text-gray-900">{kpi.value}</p>
            {kpi.change !== null && (
              <p className={`text-xs font-medium mt-1 ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change >= 0 ? '▲' : '▼'} {Math.abs(kpi.change).toFixed(1)}% vs last period
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
        <AdminRevenueChart />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-5 text-sm font-bold text-gray-400">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{formatPrice(Number(p.salePrice || p.basePrice))}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{p.soldCount} sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Order Breakdown (30d)</h2>
          <div className="space-y-3">
            {data.conversionData.map(({ status, _count }) => (
              <div key={status} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{status}</span>
                    <span className="text-gray-500">{_count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gold-400 h-1.5 rounded-full"
                      style={{ width: `${data.ordersThisMonth ? (_count / data.ordersThisMonth) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
