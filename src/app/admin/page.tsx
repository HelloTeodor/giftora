import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Users, Package, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { AdminRevenueChart } from '@/components/admin/AdminRevenueChart';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard | Giftora' };

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalRevenue, lastMonthRevenue, totalOrders, pendingOrders,
    totalCustomers, totalProducts, lowStockProducts, recentOrders
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.product.findMany({
      where: { status: 'ACTIVE', stock: { lte: 5 } },
      select: { name: true, stock: true, sku: true },
      take: 5,
      orderBy: { stock: 'asc' },
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { items: { take: 1 } },
    }),
  ]);

  return {
    totalRevenue: Number(totalRevenue._sum.total || 0),
    lastMonthRevenue: Number(lastMonthRevenue._sum.total || 0),
    totalOrders,
    pendingOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    recentOrders,
  };
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(data.totalRevenue),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      change: data.lastMonthRevenue > 0
        ? `+${Math.round(((data.totalRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100)}%`
        : null,
    },
    {
      label: 'Total Orders',
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-100',
      change: `${data.pendingOrders} pending`,
    },
    {
      label: 'Total Customers',
      value: data.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
      change: null,
    },
    {
      label: 'Active Products',
      value: data.totalProducts.toString(),
      icon: Package,
      color: 'text-gold-600 bg-gold-100',
      change: `${data.lowStockProducts.length} low stock`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with Giftora.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              {stat.change && (
                <span className="text-xs font-medium text-gray-500">{stat.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 font-serif">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-gray-900">Revenue Overview</h2>
            <Link href="/admin/analytics" className="text-sm text-gold-600 hover:underline">Full report →</Link>
          </div>
          <AdminRevenueChart />
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="font-serif text-xl font-bold text-gray-900">Low Stock</h2>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">All products are well stocked! ✓</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map(p => (
                <div key={p.sku} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-36">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.sku}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
              <Link href="/admin/products?filter=low-stock" className="text-xs text-gold-600 hover:underline block mt-2">
                Manage inventory →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="font-serif text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <Link href="/admin/orders" className="text-sm text-gold-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="text-left px-6 py-3">Order</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-left px-6 py-3">Total</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{formatPrice(Number(order.total))}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-gold-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
