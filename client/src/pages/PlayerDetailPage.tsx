import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'

interface PlayerDetail {
  id: number
  first_name: string
  last_name: string
  born_year: number | null
  jersey_number: number | null
  salary: string | null
  positions: { name: string; short_name: string }
  team_players: Array<{ teams: { name: string } }>
  match_stats: Array<{
    goals: number
    assists: number
    yellow_cards: number
    minutes_played: number
    matches: { match_date: string }
  }>
}

export default function PlayerDetailPage() {
  const { id } = useParams()
  const [player, setPlayer] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`/api/players/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setPlayer(data); setLoading(false) })
  }, [id])

  if (loading) return <Message>Loading...</Message>
  if (!player) return <Message>Player not found</Message>

  const totalGoals = player.match_stats.reduce((s, m) => s + (m.goals || 0), 0)
  const totalAssists = player.match_stats.reduce((s, m) => s + (m.assists || 0), 0)
  const totalCards = player.match_stats.reduce((s, m) => s + (m.yellow_cards || 0), 0)
  const totalMinutes = player.match_stats.reduce((s, m) => s + (m.minutes_played || 0), 0)
  const currentTeam = player.team_players[player.team_players.length - 1]

  return (
    <Page>
      <Back to="/players">← Back to players</Back>
      <Header>
        <Name>{player.first_name} {player.last_name}</Name>
        <Badge>{player.positions.name}</Badge>
        {currentTeam && <Badge>{currentTeam.teams.name}</Badge>}
        <InfoRow>
          {player.born_year && (
            <InfoItem>Born: <span>{player.born_year}</span></InfoItem>
          )}
          {player.jersey_number && (
            <InfoItem>Number: <span>#{player.jersey_number}</span></InfoItem>
          )}
          {player.salary && (
            <InfoItem>Salary: <span>${Number(player.salary).toLocaleString()}</span></InfoItem>
          )}
        </InfoRow>
      </Header>

      <Section>
        <SectionTitle>Statistics</SectionTitle>
        <StatsGrid>
          <StatBox><div>{totalGoals}</div><div>Goals</div></StatBox>
          <StatBox><div>{totalAssists}</div><div>Assists</div></StatBox>
          <StatBox><div>{totalCards}</div><div>Yellow cards</div></StatBox>
          <StatBox><div>{totalMinutes}</div><div>Minutes</div></StatBox>
        </StatsGrid>
      </Section>
    </Page>
  )
}

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 16px;
`

const Back = styled(Link)`
  color: #4fc3f7;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 24px;
  &:hover { text-decoration: underline; }
`

const Header = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 24px;
  border: 1px solid #2a2a4a;
`

const Name = styled.h1`
  font-size: 32px;
  margin: 0 0 12px;
  color: #fff;
`

const Badge = styled.span`
  background: #4fc3f7;
  color: #0f0f1a;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 13px;
  font-weight: 700;
  margin-right: 8px;
`

const InfoRow = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 16px;
  flex-wrap: wrap;
`

const InfoItem = styled.div`
  color: #aaa;
  font-size: 14px;
  span { color: #e0e0e0; font-weight: 600; }
`

const Section = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #2a2a4a;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #4fc3f7;
  margin: 0 0 16px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  text-align: center;
`

const StatBox = styled.div`
  background: #0f0f1a;
  border-radius: 8px;
  padding: 12px;
  div:first-child { font-size: 28px; font-weight: 700; color: #4fc3f7; }
  div:last-child { font-size: 12px; color: #888; margin-top: 4px; }
`

const Message = styled.div`
  color: #888;
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
`
