import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Modal, { Field, Label, Input, Select, FormActions, BtnPrimary, BtnSecondary } from '../components/Modal'

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

interface Meta {
  positions: { id: number; name: string }[]
  teams: { id: number; name: string }[]
}

const emptyForm = { first_name: '', last_name: '', position_id: '', jersey_number: '', born_year: '', salary: '', team_id: '' }

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta>({ positions: [], teams: [] })
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Player | null>(null)
  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()
  const importRef = useRef<HTMLInputElement>(null)

  const load = (s: string) => {
    const query = s ? `?search=${encodeURIComponent(s)}` : ''
    fetch(`/api/players${query}`)
      .then((r) => r.json())
      .then((data) => { setPlayers(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => {
    fetch('/api/meta').then((r) => r.json()).then(setMeta)
  }, [])

  useEffect(() => { load(search) }, [search])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModal('add')
  }

  const openEdit = (e: React.MouseEvent, p: Player) => {
    e.stopPropagation()
    setEditing(p)
    setForm({
      first_name: p.first_name,
      last_name: p.last_name,
      position_id: String(p.positions?.['id'] ?? ''),
      jersey_number: p.jersey_number ? String(p.jersey_number) : '',
      born_year: p.born_year ? String(p.born_year) : '',
      salary: p.salary ? String(p.salary) : '',
      team_id: '',
    })
    setModal('edit')
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm('Delete this player?')) return
    await fetch(`/api/players/${id}`, { method: 'DELETE' })
    load(search)
  } 

  const handleSubmit = async () => {
    const body = {
      first_name: form.first_name,
      last_name: form.last_name,
      position_id: Number(form.position_id),
      jersey_number: form.jersey_number ? Number(form.jersey_number) : null,
      born_year: form.born_year ? Number(form.born_year) : null,
      salary: form.salary ? Number(form.salary) : null,
      team_id: form.team_id ? Number(form.team_id) : undefined,
    }
    if (modal === 'add') {
      await fetch('/api/players', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else if (editing) {
      await fetch(`/api/players/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setModal(null)
    load(search)
  }

  const handleExport = async () => {
    const res = await fetch('/api/players/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'players.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/players/import', { method: 'POST', body: fd })
    const result = await res.json()
    alert(`Imported: ${result.created} players, skipped: ${result.skipped}`)
    e.target.value = ''
    load(search)
  }

  const f = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  })

  return (
    <Page>
      <Header>
        <Title>Players</Title>
        <HeaderRight>
          <SearchInput placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <ExcelBtn onClick={handleExport}>Export Excel</ExcelBtn>
          <ExcelBtn onClick={() => importRef.current?.click()}>Import Excel</ExcelBtn>
          <input ref={importRef} type="file" accept=".xlsx" style={{ display: 'none' }} onChange={handleImport} />
          <AddBtn onClick={openAdd}>+ Add Player</AddBtn>
        </HeaderRight>
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
              <Th />
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
                  <Td $dim $right>{p.salary ? `$${Number(p.salary).toLocaleString()}` : '—'}</Td>
                  <Td>
                    <Actions>
                      <ActionBtn onClick={(e) => openEdit(e, p)}>Edit</ActionBtn>
                      <ActionBtn $danger onClick={(e) => handleDelete(e, p.id)}>Del</ActionBtn>
                    </Actions>
                  </Td>
                </Tr>
              )
            })}
          </tbody>
        </Table>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Player' : 'Edit Player'} onClose={() => setModal(null)}>
          <Field><Label>First Name</Label><Input {...f('first_name')} /></Field>
          <Field><Label>Last Name</Label><Input {...f('last_name')} /></Field>
          <Field>
            <Label>Position</Label>
            <Select {...f('position_id')}>
              <option value="">— Select —</option>
              {meta.positions.map((pos) => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
            </Select>
          </Field>
          <Field><Label>Jersey Number</Label><Input type="number" {...f('jersey_number')} /></Field>
          <Field><Label>Born Year</Label><Input type="number" {...f('born_year')} /></Field>
          <Field><Label>Salary (USD)</Label><Input type="number" {...f('salary')} /></Field>
          <Field>
            <Label>Club{modal === 'edit' ? ' (leave blank to keep current)' : ''}</Label>
            <Select {...f('team_id')}>
              <option value="">— No club —</option>
              {meta.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <FormActions>
            <BtnSecondary onClick={() => setModal(null)}>Cancel</BtnSecondary>
            <BtnPrimary onClick={handleSubmit}>Save</BtnPrimary>
          </FormActions>
        </Modal>
      )}
    </Page>
  )
}

const Page = styled.div`max-width: 1000px; margin: 0 auto; padding: 32px 16px;`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

const HeaderRight = styled.div`display: flex; gap: 10px; align-items: center; flex-wrap: wrap;`

const Title = styled.h1`font-size: 24px; color: #fff; margin: 0;`

const SearchInput = styled.input`
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #1a1a2e;
  color: #e0e0e0;
  font-size: 14px;
  width: 220px;
  outline: none;
  &:focus { border-color: #4fc3f7; }
`

const ExcelBtn = styled.button`
  background: transparent;
  color: #66bb6a;
  border: 1px solid #66bb6a;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #66bb6a; color: #0f0f1a; }
`

const AddBtn = styled.button`
  background: #4fc3f7;
  color: #0f0f1a;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #81d4fa; }
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

const PlayerName = styled.span`font-weight: 600; color: #fff; font-size: 15px;`

const PosBadge = styled.span`
  background: #4fc3f7;
  color: #0f0f1a;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 700;
`

const Actions = styled.div`display: flex; gap: 6px; justify-content: flex-end;`

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: 1px solid ${p => p.$danger ? '#5a2020' : '#2a2a4a'};
  color: ${p => p.$danger ? '#e57373' : '#888'};
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background: ${p => p.$danger ? '#5a2020' : '#2a2a4a'};
    color: #fff;
  }
`

const Message = styled.div`color: #888; font-size: 15px; margin-top: 40px; text-align: center;`
