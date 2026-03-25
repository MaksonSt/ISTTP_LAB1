import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getTeamLogo } from '../utils/teamLogos'

interface StandingRow {
  team: { id: number; name: string }
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  points: number
}

interface Match {
  id: number
  match_date: string
  home_score: number | null
  away_score: number | null
  teams_matches_home_team_idToteams: { name: string }
  teams_matches_away_team_idToteams: { name: string }
}

interface TournamentDetail {
  id: number
  name: string
  season: string
  start_date: string | null
  end_date: string | null
  tournament_countries: { name: string }
  matches: Match[]
}

export default function TournamentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [standings, setStandings] = useState<StandingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/tournaments/${id}`).then((r) => r.json()),
      fetch(`/api/tournaments/${id}/standings`).then((r) => r.json()),
    ]).then(([t, s]) => {
      setTournament(t)
      setStandings(Array.isArray(s) ? s : [])
      setLoading(false)
    })
  }, [id])

  if (loading) return <Message>Loading...</Message>
  if (!tournament) return <Message>Tournament not found</Message>

  const recentMatches = [...tournament.matches].slice(0, 10)

  return (
    <Page>
      <Back to="/tournaments">← Back to tournaments</Back>

      <Header>
        <TournName>{tournament.name}</TournName>
        <TournMeta>
          <span>{tournament.season}</span>
          <Dot>·</Dot>
          <span>{tournament.tournament_countries.name}</span>
          {tournament.start_date && (
            <>
              <Dot>·</Dot>
              <span>
                {new Date(tournament.start_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                {' — '}
                {tournament.end_date
                  ? new Date(tournament.end_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '?'}
              </span>
            </>
          )}
        </TournMeta>
      </Header>

      <Section>
        <SectionTitle>Standings</SectionTitle>
        <StandingsTable>
          <thead>
            <tr>
              <Th $pos>#</Th>
              <Th>Club</Th>
              <Th $center>MP</Th>
              <Th $center>W</Th>
              <Th $center>D</Th>
              <Th $center>L</Th>
              <Th $center>GF</Th>
              <Th $center>GA</Th>
              <Th $center>GD</Th>
              <Th $center $pts>Pts</Th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => (
              <StandingTr key={row.team.id} onClick={() => navigate(`/teams/${row.team.id}`)}>

                <PosCell>{i + 1}</PosCell>
                <TeamCell>
                  <LogoBox>
                    {getTeamLogo(row.team.name)
                      ? <img src={getTeamLogo(row.team.name)!} alt={row.team.name} />
                      : <Initials>{row.team.name.slice(0, 2).toUpperCase()}</Initials>
                    }
                  </LogoBox>
                  <TeamCellName>{row.team.name}</TeamCellName>
                </TeamCell>
                <Td $center $dim>{row.played}</Td>
                <Td $center>{row.won}</Td>
                <Td $center $dim>{row.drawn}</Td>
                <Td $center $dim>{row.lost}</Td>
                <Td $center $dim>{row.gf}</Td>
                <Td $center $dim>{row.ga}</Td>
                <Td $center $dim>{row.gf - row.ga > 0 ? `+${row.gf - row.ga}` : row.gf - row.ga}</Td>
                <PtsCell>{row.points}</PtsCell>
              </StandingTr>
            ))}
          </tbody>
        </StandingsTable>
      </Section>

      {recentMatches.length > 0 && (
        <Section>
          <SectionTitle>Recent Matches</SectionTitle>
          <MatchList>
            {recentMatches.map((m) => (
              <MatchRow key={m.id}>
                <MatchDate>
                  {new Date(m.match_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </MatchDate>
                <MatchTeams>
                  <MatchTeam $right>{m.teams_matches_home_team_idToteams.name}</MatchTeam>
                  <Score>
                    {m.home_score ?? '—'} : {m.away_score ?? '—'}
                  </Score>
                  <MatchTeam>{m.teams_matches_away_team_idToteams.name}</MatchTeam>
                </MatchTeams>
              </MatchRow>
            ))}
          </MatchList>
        </Section>
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

const Header = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 20px;
  border: 1px solid #2a2a4a;
`

const TournName = styled.h1`
  font-size: 28px;
  margin: 0 0 8px;
  color: #fff;
`

const TournMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #888;
  flex-wrap: wrap;
`

const Dot = styled.span`
  color: #444;
`

const Section = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #2a2a4a;
  margin-bottom: 20px;
`

const SectionTitle = styled.h2`
  font-size: 16px;
  color: #4fc3f7;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 12px;
`

const StandingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th<{ $center?: boolean; $pts?: boolean; $pos?: boolean }>`
  text-align: ${p => p.$center || p.$pos ? 'center' : 'left'};
  padding: 8px 10px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
  border-bottom: 1px solid #2a2a4a;
  font-weight: 600;
  width: ${p => p.$pos ? '32px' : p.$pts ? '44px' : 'auto'};
  color: ${p => p.$pts ? '#4fc3f7' : '#555'};
`

const StandingTr = styled.tr`
  display: table-row;
  text-decoration: none;
  color: #e0e0e0;
  cursor: pointer;
  &:hover td { background: #202040; }
  &:not(:last-child) td { border-bottom: 1px solid #1f1f3a; }
`

const Td = styled.td<{ $center?: boolean; $dim?: boolean }>`
  padding: 10px 10px;
  font-size: 14px;
  text-align: ${p => p.$center ? 'center' : 'left'};
  color: ${p => p.$dim ? '#666' : '#e0e0e0'};
`

const PosCell = styled.td`
  padding: 10px;
  text-align: center;
  font-size: 13px;
  color: #555;
  width: 32px;
`

const TeamCell = styled.td`
  padding: 11px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const LogoBox = styled.div`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: contain; }
`

const Initials = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2a2a4a;
  color: #4fc3f7;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TeamCellName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
`

const PtsCell = styled.td`
  padding: 10px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  width: 44px;
`

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const MatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #13132a;
`

const MatchDate = styled.div`
  font-size: 12px;
  color: #555;
  width: 90px;
  flex-shrink: 0;
`

const MatchTeams = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`

const MatchTeam = styled.div<{ $right?: boolean }>`
  flex: 1;
  font-size: 14px;
  color: #ccc;
  text-align: ${p => p.$right ? 'right' : 'left'};
`

const Score = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  min-width: 60px;
  text-align: center;
  background: #2a2a4a;
  border-radius: 6px;
  padding: 4px 10px;
`

const Message = styled.div`
  color: #888;
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
`
