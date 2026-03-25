import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getTeamLogo } from '../utils/teamLogos'

interface Team {
  id: number
  name: string
  stadium: string | null
  founded_year: number | null
  team_cities: { name: string }
  _count: { team_players: number }
  tournament_teams: Array<{ tournaments: { name: string } }>
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then((data) => { setTeams(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <Page>
      <Title>Clubs</Title>
      {loading && <Message>Loading...</Message>}
      <Table>
        <thead>
          <tr>
            <Th>Club</Th>
            <Th>City</Th>
            <Th>Stadium</Th>
            <Th>Founded</Th>
            <Th $right>Players</Th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t) => (
            <Tr key={t.id} onClick={() => navigate(`/teams/${t.id}`)}>
              <Td>
                <ClubCell>
                  <LogoBox>
                    {getTeamLogo(t.name)
                      ? <img src={getTeamLogo(t.name)!} alt={t.name} />
                      : <Initials>{t.name.slice(0, 2).toUpperCase()}</Initials>
                    }
                  </LogoBox>
                  <TeamName>{t.name}</TeamName>
                </ClubCell>
              </Td>
              <Td $dim>{t.team_cities.name}</Td>
              <Td $dim>{t.stadium ?? '—'}</Td>
              <Td $dim>{t.founded_year ?? '—'}</Td>
              <Td $dim $right>{t._count.team_players}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Page>
  )
}

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 16px;
`

const Title = styled.h1`
  font-size: 24px;
  color: #fff;
  margin: 0 0 20px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #1a1a2e;
  border-radius: 10px;
  overflow: hidden;
`

const Th = styled.th<{ $right?: boolean }>`
  text-align: ${p => p.$right ? 'right' : 'left'};
  padding: 12px 16px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
  background: #13132a;
  border-bottom: 1px solid #2a2a4a;
  font-weight: 600;
`

const Tr = styled.tr`
  cursor: pointer;
  &:hover td { background: #202040; }
  &:not(:last-child) td { border-bottom: 1px solid #1f1f3a; }
`

const Td = styled.td<{ $dim?: boolean; $right?: boolean }>`
  padding: 12px 16px;
  font-size: 14px;
  color: ${p => p.$dim ? '#888' : '#e0e0e0'};
  text-align: ${p => p.$right ? 'right' : 'left'};
  transition: background 0.15s;
`

const ClubCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const LogoBox = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: contain; }
`

const Initials = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2a2a4a;
  color: #4fc3f7;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TeamName = styled.span`
  font-weight: 600;
  color: #fff;
  font-size: 15px;
`

const Message = styled.div`
  color: #888;
  font-size: 15px;
  margin-top: 40px;
  text-align: center;
`
