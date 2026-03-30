'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data — in production this would be fetched from the API
const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 3800 },
  { month: 'Mar', revenue: 5100 },
  { month: 'Apr', revenue: 4700 },
  { month: 'May', revenue: 6200 },
  { month: 'Jun', revenue: 5800 },
  { month: 'Jul', revenue: 7100 },
  { month: 'Aug', revenue: 6900 },
  { month: 'Sep', revenue: 8200 },
  { month: 'Oct', revenue: 9100 },
  { month: 'Nov', revenue: 11200 },
  { month: 'Dec', revenue: 13800 },
];

export function AdminRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c8941e" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#c8941e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4ede2" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9a7453' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9a7453' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid #e5dfcc', fontSize: 13 }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Revenue']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#c8941e"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
