import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { getTeamLogo } from '../utils/teamLogos'

interface TeamDetail {
  id: number
  name: string
  stadium: string | null
  founded_year: number | null
  team_cities: { name: string }
  tournament_teams: Array<{ tournaments: { name: string; season: string } }>
  team_players: Array<{
    is_captain: boolean
    joined_date: string | null
    players: {
      id: number
      first_name: string
      last_name: string
      jersey_number: number | null
      born_year: number | null
      positions: { name: string; short_name: string }
    }
  }>
  matches_matches_home_team_idToteams: Array<{
    id: number
    match_date: string
    home_score: number | null
    away_score: number | null
    tournaments: { name: string }
    teams_matches_away_team_idToteams: { name: string }
  }>
  matches_matches_away_team_idToteams: Array<{
    id: number
    match_date: string
    home_score: number | null
    away_score: number | null
    tournaments: { name: string }
    teams_matches_home_team_idToteams: { name: string }
  }>
}

export default function TeamDetailPage() {
  const { id } = useParams()
  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/teams/${id}`)
      .then((r) => r.json())
      .then((data) => { setTeam(data); setLoading(false) })
  }, [id])

  if (loading) return <Message>Loading...</Message>
  if (!team) return <Message>Team not found</Message>

  const byPosition: Record<string, typeof team.team_players> = {}
  for (const tp of team.team_players) {
    const pos = tp.players.positions.name
    if (!byPosition[pos]) byPosition[pos] = []
    byPosition[pos].push(tp)
  }

  return (
    <Page>
      <Back to="/teams">← Back to clubs</Back>

      <Header>
        <HeaderTop>
          {getTeamLogo(team.name) && (
            <LogoBox>
              <img src={getTeamLogo(team.name)!} alt={team.name} />
            </LogoBox>
          )}
          <TeamName>{team.name}</TeamName>
        </HeaderTop>
        <Meta>
          <MetaItem>{team.team_cities.name}</MetaItem>
          {team.stadium && <MetaItem>{team.stadium}</MetaItem>}
          {team.founded_year && <MetaItem>Est. {team.founded_year}</MetaItem>}
        </Meta>
        <Tournaments>
          {team.tournament_teams.map((tt, i) => (
            <TournBadge key={i}>{tt.tournaments.name} {tt.tournaments.season}</TournBadge>
          ))}
        </Tournaments>
      </Header>

      <Section>
        <SectionTitle>Squad ({team.team_players.length})</SectionTitle>
        {Object.entries(byPosition).map(([pos, players]) => (
          <div key={pos}>
            <PosHeader>{pos}</PosHeader>
            <SquadTable>
              <tbody>
                {players.map(({ players: p, is_captain }) => (
                  <SquadRow key={p.id} to={`/players/${p.id}`}>
                    <Td $dim>{p.jersey_number ? `#${p.jersey_number}` : '—'}</Td>
                    <Td>
                      {p.first_name} {p.last_name}
                      {is_captain && <Captain>C</Captain>}
                    </Td>
                    <Td $dim>{p.born_year ? new Date().getFullYear() - p.born_year : '—'}</Td>
                  </SquadRow>
                ))}
              </tbody>
            </SquadTable>
          </div>
        ))}
      </Section>
    </Page>
  )
}

const Page = styled.div`
  max-width: 900px;
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
  margin-bottom: 20px;
  border: 1px solid #2a2a4a;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`

const LogoBox = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: contain; }
`

const TeamName = styled.h1`
  font-size: 30px;
  margin: 0;
  color: #fff;
`

const Meta = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`

const MetaItem = styled.span`
  font-size: 14px;
  color: #888;
`

const Tournaments = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const TournBadge = styled.span`
  background: #2a2a4a;
  color: #4fc3f7;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 12px;
`

const Section = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #2a2a4a;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #4fc3f7;
  margin: 0 0 16px;
`

const PosHeader = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
  padding: 8px 12px 4px;
  font-weight: 600;
`

const SquadTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
`

const SquadRow = styled(Link)`
  display: table-row;
  text-decoration: none;
  color: #e0e0e0;
  &:hover td { background: #202040; }
  td { border-bottom: 1px solid #1f1f3a; }
`

const Td = styled.td<{ $dim?: boolean }>`
  padding: 10px 12px;
  font-size: 14px;
  color: ${p => p.$dim ? '#666' : '#e0e0e0'};
  width: ${p => p.$dim ? '60px' : 'auto'};
`

const Captain = styled.span`
  background: #4fc3f7;
  color: #0f0f1a;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 10px;
  font-weight: 700;
  margin-left: 8px;
`

const Message = styled.div`
  color: #888;
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
`
