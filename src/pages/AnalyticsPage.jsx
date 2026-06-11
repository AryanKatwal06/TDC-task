import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import AppShell from '@/components/layout/AppShell'
import Card from '@/components/ui/Card'
import { useClients } from '@/hooks/useClients'

function StatCard({ title, value, subtitle }) {
  return (
    <Card className="p-4">
      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(245,237,220,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{title}</h3>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#f5eddc', fontWeight: 600, marginBottom: '4px' }}>{value}</div>
      {subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#dc9e4a' }}>{subtitle}</p>}
    </Card>
  )
}

export default function AnalyticsPage() {
  const clients = useClients()

  const stats = useMemo(() => {
    const total = clients.length
    const matched = clients.filter(c => c.statusTag === 'Matched').length
    const sentCount = clients.reduce((acc, c) => acc + (c.sentMatches?.length || 0), 0)
    
    // Mock accepted introductions for MVP
    const acceptedCount = Math.floor(sentCount * 0.45) 
    const acceptanceRate = sentCount > 0 ? Math.round((acceptedCount / sentCount) * 100) : 0

    return { total, matched, sentCount, acceptanceRate, acceptedCount }
  }, [clients])

  const pipelineData = [
    { name: 'Leads', count: clients.length },
    { name: 'Active', count: clients.filter(c => c.statusTag === 'Active').length },
    { name: 'Intro Sent', count: clients.filter(c => (c.sentMatches?.length || 0) > 0).length },
    { name: 'Meetings', count: Math.floor(clients.length * 0.3) },
    { name: 'Success', count: clients.filter(c => c.statusTag === 'Matched').length },
  ]

  const trendData = [
    { month: 'Jan', matches: 4 },
    { month: 'Feb', matches: 7 },
    { month: 'Mar', matches: 12 },
    { month: 'Apr', matches: 10 },
    { month: 'May', matches: 15 },
    { month: 'Jun', matches: 22 },
  ]

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: '#f5eddc', fontWeight: 500, fontStyle: 'italic', marginBottom: '8px' }}>Performance Analytics</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(245,237,220,0.6)', marginBottom: '32px' }}>Monitor your matchmaking pipeline and success metrics.</p>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Profiles" value={stats.total} />
          <StatCard title="Active Searches" value={pipelineData[1].count} subtitle="+2 this week" />
          <StatCard title="Intros Sent" value={stats.sentCount} subtitle={`${stats.acceptedCount} accepted`} />
          <StatCard title="Acceptance Rate" value={`${stats.acceptanceRate}%`} subtitle="Above average" />
          <StatCard title="Total Matched" value={stats.matched} subtitle="YTD 2026" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#f5eddc', fontWeight: 600, marginBottom: '24px' }}>Pipeline Funnel</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2c2c2c" />
                  <XAxis type="number" stroke="#888" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={80} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#dc9e4a" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#f5eddc', fontWeight: 600, marginBottom: '24px' }}>Match Success Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc9e4a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc9e4a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2c" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="matches" stroke="#dc9e4a" strokeWidth={2} fillOpacity={1} fill="url(#colorMatches)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}