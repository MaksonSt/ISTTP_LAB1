import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

interface Player {
  id: number
  first_name: string
  last_name: string
  born_year: number | null
  jersey_number: number | null
  salary: string | null
  positions: { name: string; short_name: string }
  team_players: Array<{ teams: { name: string } }>
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    fetch(`/api/players${query}`)
      .then((r) => r.json())
      .then((data) => { setPlayers(Array.isArray(data) ? data : []); setLoading(false) })
  }, [search])

  return (
    <Page>
      <Header>
        <Title>Players</Title>
        <SearchInput
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Header>

      {loading && <Message>Loading...</Message>}
      {!loading && players.length === 0 && <Message>No players found</Message>}

      {!loading && players.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Player</Th>
              <Th>Position</Th>
              <Th>Club</Th>
              <Th>Age</Th>
              <Th $right>Salary</Th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              const currentTeam = p.team_players[p.team_players.length - 1]?.teams
              const age = p.born_year ? new Date().getFullYear() - p.born_year : null

              return (
                <Tr key={p.id} onClick={() => navigate(`/players/${p.id}`)}>
                  <Td $dim>{p.jersey_number ? `#${p.jersey_number}` : i + 1}</Td>
                  <Td><PlayerName>{p.first_name} {p.last_name}</PlayerName></Td>
                  <Td><PosBadge>{p.positions.name}</PosBadge></Td>
                  <Td $dim>{currentTeam?.name ?? '—'}</Td>
                  <Td $dim>{age ?? '—'}</Td>
                  <Td $dim $right>
                    {p.salary ? `$${Number(p.salary).toLocaleString()}` : '—'}
                  </Td>
                </Tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </Page>
  )
}

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 16px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

const Title = styled.h1`
  font-size: 24px;
  color: #fff;
  margin: 0;
`

const SearchInput = styled.input`
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #1a1a2e;
  color: #e0e0e0;
  font-size: 14px;
  width: 240px;
  outline: none;
  &:focus { border-color: #4fc3f7; }
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

const PlayerName = styled.span`
  font-weight: 600;
  color: #fff;
  font-size: 15px;
`

const PosBadge = styled.span`
  background: #4fc3f7;
  color: #0f0f1a;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 700;
`

const Message = styled.div`
  color: #888;
  font-size: 15px;
  margin-top: 40px;
  text-align: center;
`
