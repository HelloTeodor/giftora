'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  label: string;
  revenue: number;
}

export function AdminRevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c8941e" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#c8941e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4ede2" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9a7453' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9a7453' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v === 0 ? '€0' : v >= 1000 ? `€${(v / 1000).toFixed(1)}k` : `€${v}`}
          width={52}
        />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid #e5dfcc', fontSize: 13, background: '#fff' }}
          formatter={(value: number) => [`€${value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue']}
          labelStyle={{ color: '#1a1a2e', fontWeight: 600, marginBottom: 4 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#c8941e"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#c8941e', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
