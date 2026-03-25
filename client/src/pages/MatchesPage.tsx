import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

interface Match {
  id: number
  match_date: string
  home_score: number | null
  away_score: number | null
  tournaments: { id: number; name: string; season: string }
  teams_matches_home_team_idToteams: { name: string }
  teams_matches_away_team_idToteams: { name: string }
  referees: { first_name: string; last_name: string } | null
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [tournaments, setTournaments] = useState<{ id: number; name: string }[]>([])
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/tournaments')
      .then((r) => r.json())
      .then((data) => setTournaments(Array.isArray(data) ? data : []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = selectedTournament
      ? `/api/matches?tournamentId=${selectedTournament}`
      : '/api/matches'
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setMatches(Array.isArray(data) ? data : []); setLoading(false) })
  }, [selectedTournament])

  const grouped: Record<string, Match[]> = {}
  for (const m of matches) {
    const key = m.tournaments.name
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(m)
  }

  return (
    <Page>
      <Header>
        <Title>Matches</Title>
        <Filters>
          <FilterBtn $active={selectedTournament === null} onClick={() => setSelectedTournament(null)}>
            All
          </FilterBtn>
          {tournaments.map((t) => (
            <FilterBtn
              key={t.id}
              $active={selectedTournament === t.id}
              onClick={() => setSelectedTournament(t.id)}
            >
              {t.name}
            </FilterBtn>
          ))}
        </Filters>
      </Header>

      {loading && <Message>Loading...</Message>}

      {Object.entries(grouped).map(([tournName, ms]) => (
        <Group key={tournName}>
          <GroupTitle>{tournName}</GroupTitle>
          <MatchList>
            {ms.map((m) => (
              <MatchRow key={m.id} onClick={() => navigate(`/matches/${m.id}`)}>
                <DateCol>
                  {new Date(m.match_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </DateCol>
                <TeamsRow>
                  <HomeTeam>{m.teams_matches_home_team_idToteams.name}</HomeTeam>
                  <ScoreBadge>
                    <ScoreNum>{m.home_score ?? '—'}</ScoreNum>
                    <ScoreSep>:</ScoreSep>
                    <ScoreNum>{m.away_score ?? '—'}</ScoreNum>
                  </ScoreBadge>
                  <AwayTeam>{m.teams_matches_away_team_idToteams.name}</AwayTeam>
                </TeamsRow>
                <RefCol>
                  {m.referees ? `${m.referees.first_name[0]}. ${m.referees.last_name}` : ''}
                </RefCol>
              </MatchRow>
            ))}
          </MatchList>
        </Group>
      ))}

      {!loading && matches.length === 0 && <Message>No matches found</Message>}
    </Page>
  )
}

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
`

const Header = styled.div`
  margin-bottom: 28px;
`

const Title = styled.h1`
  font-size: 24px;
  color: #fff;
  margin: 0 0 16px;
`

const Filters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const FilterBtn = styled.button<{ $active: boolean }>`
  background: ${p => p.$active ? '#4fc3f7' : '#1a1a2e'};
  color: ${p => p.$active ? '#0f0f1a' : '#888'};
  border: 1px solid ${p => p.$active ? '#4fc3f7' : '#2a2a4a'};
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  font-weight: ${p => p.$active ? '600' : '400'};
  transition: all 0.15s;
  &:hover {
    border-color: #4fc3f7;
    color: ${p => p.$active ? '#0f0f1a' : '#4fc3f7'};
  }
`

const Group = styled.div`
  margin-bottom: 24px;
`

const GroupTitle = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4fc3f7;
  font-weight: 700;
  margin-bottom: 8px;
  padding: 0 4px;
`

const MatchList = styled.div`
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  overflow: hidden;
`

const MatchRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  cursor: pointer;
  gap: 12px;
  transition: background 0.12s;
  &:not(:last-child) { border-bottom: 1px solid #1f1f3a; }
  &:hover { background: #202040; }
`

const DateCol = styled.div`
  font-size: 12px;
  color: #4a4a6a;
  width: 60px;
  flex-shrink: 0;
  white-space: nowrap;
`

const TeamsRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`

const HomeTeam = styled.div`
  flex: 1;
  text-align: right;
  font-size: 14px;
  color: #d0d0d0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AwayTeam = styled.div`
  flex: 1;
  text-align: left;
  font-size: 14px;
  color: #d0d0d0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ScoreBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #13132a;
  border: 1px solid #2a2a4a;
  border-radius: 6px;
  padding: 4px 10px;
  flex-shrink: 0;
`

const ScoreNum = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  min-width: 14px;
  text-align: center;
`

const ScoreSep = styled.span`
  font-size: 13px;
  color: #3a3a5a;
`

const RefCol = styled.div`
  font-size: 12px;
  color: #3a3a5a;
  width: 100px;
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;
`

const Message = styled.div`
  color: #888;
  font-size: 15px;
  text-align: center;
  margin-top: 40px;
`
