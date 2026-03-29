import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import styled from 'styled-components'

interface StatsData {
  topScorers: { id: number; name: string; team: string; goals: number; assists: number }[]
  goalsByTeam: { name: string; scored: number; conceded: number }[]
  playersByPosition: { position: string; count: number }[]
}

const PIE_COLORS = ['#4fc3f7', '#cc2229', '#346ba5', '#f9a825', '#66bb6a', '#ab47bc']

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <Message>Loading...</Message>
  if (!data) return <Message>No data</Message>

  return (
    <Page>
      <Title>Statistics</Title>

      <Grid>
        <Card>
          <CardTitle>Top Scorers</CardTitle>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data.topScorers} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#666', fontSize: 12 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#ccc', fontSize: 12 }}
                width={130}
              />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [value, name === 'goals' ? 'Goals' : 'Assists']}
              />
              <Bar dataKey="goals" fill="#4fc3f7" radius={[0, 4, 4, 0]} maxBarSize={16} />
              <Bar dataKey="assists" fill="#346ba5" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
          <ChartLegend>
            <Dot color="#4fc3f7" /> Goals
            <Dot color="#346ba5" /> Assists
          </ChartLegend>
        </Card>

        <Card>
          <CardTitle>Players by Position</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.playersByPosition}
                dataKey="count"
                nameKey="position"
                cx="50%"
                cy="45%"
                outerRadius={90}
                innerRadius={44}
                paddingAngle={3}
              >
                {data.playersByPosition.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8 }}
                formatter={(value, name) => [value, name]}
              />
              <Legend
                iconSize={10}
                iconType="circle"
                formatter={(value) => <span style={{ color: '#aaa', fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card $wide>
          <CardTitle>Goals Scored & Conceded by Club</CardTitle>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.goalsByTeam} margin={{ left: 0, right: 16, top: 4, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#aaa', fontSize: 11 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: '#666', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [value, name === 'scored' ? 'Scored' : 'Conceded']}
              />
              <Bar dataKey="scored" fill="#4fc3f7" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="conceded" fill="#cc2229" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <ChartLegend>
            <Dot color="#4fc3f7" /> Scored
            <Dot color="#cc2229" /> Conceded
          </ChartLegend>
        </Card>
      </Grid>
    </Page>
  )
}

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px;
`

const Title = styled.h1`
  font-size: 24px;
  color: #fff;
  margin: 0 0 24px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const Card = styled.div<{ $wide?: boolean }>`
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 24px;
  grid-column: ${p => p.$wide ? '1 / -1' : 'auto'};
`

const CardTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #4fc3f7;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 20px;
`

const ChartLegend = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #888;
  align-items: center;
`

const Dot = styled.span<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.color};
  margin-right: 4px;
`

const Message = styled.div`
  color: #888;
  text-align: center;
  margin-top: 80px;
  font-size: 16px;
`
