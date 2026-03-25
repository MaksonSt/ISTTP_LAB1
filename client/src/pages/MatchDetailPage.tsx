import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'

interface PlayerStat {
  goals: number
  assists: number
  yellow_cards: number
  minutes_played: number
  players: {
    id: number
    first_name: string
    last_name: string
    positions: { short_name: string }
    team_players: Array<{ teams: { id: number; name: string } }>
  }
}

interface MatchDetail {
  id: number
  match_date: string
  home_score: number | null
  away_score: number | null
  tournaments: { id: number; name: string; season: string }
  teams_matches_home_team_idToteams: { id: number; name: string }
  teams_matches_away_team_idToteams: { id: number; name: string }
  referees: { first_name: string; last_name: string; nationality: string | null } | null
  match_stats: PlayerStat[]
}

export default function MatchDetailPage() {
  const { id } = useParams()
  const [match, setMatch] = useState<MatchDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then((r) => r.json())
      .then((data) => { setMatch(data); setLoading(false) })
  }, [id])

  if (loading) return <Message>Loading...</Message>
  if (!match) return <Message>Match not found</Message>

  const homeId = match.teams_matches_home_team_idToteams.id
  const awayId = match.teams_matches_away_team_idToteams.id

  const homeStats = match.match_stats.filter(
    (s) => s.players.team_players[0]?.teams.id === homeId
  )
  const awayStats = match.match_stats.filter(
    (s) => s.players.team_players[0]?.teams.id === awayId
  )
  const unclaimed = match.match_stats.filter(
    (s) => !s.players.team_players[0]
  )

  return (
    <Page>
      <Back to="/matches">← Back to matches</Back>

      <ScoreBoard>
        <TournamentLabel>
          <Link to={`/tournaments/${match.tournaments.id}`}>
            {match.tournaments.name} {match.tournaments.season}
          </Link>
        </TournamentLabel>

        <Teams>
          <TeamName to={`/teams/${homeId}`}>
            {match.teams_matches_home_team_idToteams.name}
          </TeamName>
          <Score>
            {match.home_score ?? '—'} : {match.away_score ?? '—'}
          </Score>
          <TeamName to={`/teams/${awayId}`}>
            {match.teams_matches_away_team_idToteams.name}
          </TeamName>
        </Teams>

        <MatchMeta>
          <span>
            {new Date(match.match_date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          {match.referees && (
            <>
              <Dot>·</Dot>
              <span>
                Referee: {match.referees.first_name} {match.referees.last_name}
                {match.referees.nationality ? ` (${match.referees.nationality})` : ''}
              </span>
            </>
          )}
        </MatchMeta>
      </ScoreBoard>

      {match.match_stats.length > 0 && (
        <StatsSection>
          <SectionTitle>Player Stats</SectionTitle>
          {[
            { label: match.teams_matches_home_team_idToteams.name, stats: homeStats },
            { label: match.teams_matches_away_team_idToteams.name, stats: awayStats },
            ...(unclaimed.length > 0 ? [{ label: 'Other', stats: unclaimed }] : []),
          ].map(({ label, stats }) =>
            stats.length === 0 ? null : (
              <TeamBlock key={label}>
                <TeamBlockTitle>{label}</TeamBlockTitle>
                <StatsTable>
                  <thead>
                    <tr>
                      <Th>Player</Th>
                      <Th $center>Pos</Th>
                      <Th $center>G</Th>
                      <Th $center>A</Th>
                      <Th $center>YC</Th>
                      <Th $center>Min</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s) => (
                      <StatRow key={s.players.id} to={`/players/${s.players.id}`}>
                        <Td>
                          {s.players.first_name} {s.players.last_name}
                        </Td>
                        <Td $center $dim>{s.players.positions.short_name}</Td>
                        <Td $center>{s.goals > 0 ? <Goals>{s.goals}</Goals> : <Dim>—</Dim>}</Td>
                        <Td $center>{s.assists > 0 ? s.assists : <Dim>—</Dim>}</Td>
                        <Td $center>
                          {s.yellow_cards > 0 ? <YellowCard>{s.yellow_cards}</YellowCard> : <Dim>—</Dim>}
                        </Td>
                        <Td $center $dim>{s.minutes_played}'</Td>
                      </StatRow>
                    ))}
                  </tbody>
                </StatsTable>
              </TeamBlock>
            )
          )}
        </StatsSection>
      )}
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

const ScoreBoard = styled.div`
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
  text-align: center;
`

const TournamentLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
  margin-bottom: 16px;
  a { color: #4fc3f7; text-decoration: none; &:hover { text-decoration: underline; } }
`

const Teams = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
`

const TeamName = styled(Link)`
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  &:first-child { text-align: right; }
  &:last-child { text-align: left; }
  &:hover { color: #4fc3f7; }
`

const Score = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  min-width: 100px;
  text-align: center;
  background: #13132a;
  border-radius: 10px;
  padding: 8px 20px;
`

const MatchMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  flex-wrap: wrap;
`

const Dot = styled.span`
  color: #333;
`

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionTitle = styled.h2`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4fc3f7;
  margin: 0 0 4px;
  font-weight: 600;
`

const TeamBlock = styled.div`
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  overflow: hidden;
`

const TeamBlockTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #888;
  padding: 12px 16px;
  background: #13132a;
  border-bottom: 1px solid #2a2a4a;
`

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th<{ $center?: boolean }>`
  text-align: ${p => p.$center ? 'center' : 'left'};
  padding: 8px 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #444;
  font-weight: 600;
  border-bottom: 1px solid #1f1f3a;
`

const StatRow = styled(Link)`
  display: table-row;
  text-decoration: none;
  color: #e0e0e0;
  &:hover td { background: #202040; }
  &:not(:last-child) td { border-bottom: 1px solid #1f1f3a; }
`

const Td = styled.td<{ $center?: boolean; $dim?: boolean }>`
  padding: 10px 12px;
  font-size: 14px;
  text-align: ${p => p.$center ? 'center' : 'left'};
  color: ${p => p.$dim ? '#555' : '#e0e0e0'};
`

const Goals = styled.span`
  background: #1e4620;
  color: #4caf50;
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 700;
  font-size: 13px;
`

const YellowCard = styled.span`
  background: #7a6000;
  color: #ffd600;
  border-radius: 3px;
  padding: 2px 8px;
  font-weight: 700;
  font-size: 13px;
`

const Dim = styled.span`
  color: #333;
`

const Message = styled.div`
  color: #888;
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
`
