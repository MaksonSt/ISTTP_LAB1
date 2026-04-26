import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getTeamLogo } from '../utils/teamLogos'
import Modal, { Field, Label, Input, Select, FormActions, BtnPrimary, BtnSecondary } from '../components/Modal'

interface User {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

interface Team {
  id: number
  name: string
  stadium: string | null
  founded_year: number | null
  team_cities: { name: string }
  _count: { team_players: number }
  tournament_teams: Array<{ tournaments: { name: string } }>
}

interface Meta {
  cities: { id: number; name: string }[]
}

const emptyForm = { name: '', stadium: '', founded_year: '', city_id: '' }

export default function TeamsPage({ user }: { user: User }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta>({ cities: [] })
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Team | null>(null)
  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const load = () => {
    fetch('/api/teams', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setTeams(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => {
    fetch('/api/meta', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then(setMeta)
  }, [token])

  useEffect(() => { load() }, [token])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal('add') }

  const openEdit = (e: React.MouseEvent, t: Team) => {
    e.stopPropagation()
    setEditing(t)
    setForm({ name: t.name, stadium: t.stadium ?? '', founded_year: t.founded_year ? String(t.founded_year) : '', city_id: '' })
    setModal('edit')
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm('Delete this team?')) return
    await fetch(`/api/teams/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  const handleSubmit = async () => {
    const body = {
      name: form.name,
      stadium: form.stadium || null,
      founded_year: form.founded_year ? Number(form.founded_year) : null,
      city_id: Number(form.city_id),
    }
    if (modal === 'add') {
      await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    } else if (editing) {
      await fetch(`/api/teams/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    }
    setModal(null)
    load()
  }

  const f = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  })

  return (
    <Page>
      <Header>
        <Title>Clubs</Title>
        {user.role === 'ADMIN' && <AddBtn onClick={openAdd}>+ Add Club</AddBtn>}
      </Header>

      {loading && <Message>Loading...</Message>}

      <Table>
        <thead>
          <tr>
            <Th>Club</Th>
            <Th>City</Th>
            <Th>Stadium</Th>
            <Th>Founded</Th>
            <Th $right>Players</Th>
            <Th />
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
              <Td>
                <Actions>
                  {user.role === 'ADMIN' && (
                    <>
                      <ActionBtn onClick={(e) => openEdit(e, t)}>Edit</ActionBtn>
                      <ActionBtn $danger onClick={(e) => handleDelete(e, t.id)}>Del</ActionBtn>
                    </>
                  )}
                </Actions>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {modal && user.role === 'ADMIN' && (
        <Modal title={modal === 'add' ? 'Add Club' : 'Edit Club'} onClose={() => setModal(null)}>
          <Field><Label>Club Name</Label><Input {...f('name')} /></Field>
          <Field><Label>Stadium</Label><Input {...f('stadium')} /></Field>
          <Field><Label>Founded Year</Label><Input type="number" {...f('founded_year')} /></Field>
          <Field>
            <Label>City</Label>
            <Select {...f('city_id')}>
              <option value="">— Select —</option>
              {meta.cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
`

const Title = styled.h1`font-size: 24px; color: #fff; margin: 0;`

const AddBtn = styled.button`
  background: #4fc3f7;
  color: #0f0f1a;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #81d4fa; }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #1a1a2e;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #2a2a4a;
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

const ClubCell = styled.div`display: flex; align-items: center; gap: 12px;`

const LogoBox = styled.div`
  width: 36px; height: 36px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: contain; }
`

const Initials = styled.div`
  width: 36px; height: 36px; border-radius: 50%;
  background: #2a2a4a; color: #4fc3f7;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
`

const TeamName = styled.span`font-weight: 600; color: #fff; font-size: 15px;`

const Actions = styled.div`display: flex; gap: 6px; justify-content: flex-end;`

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: 1px solid ${p => p.$danger ? '#5a2020' : '#2a2a4a'};
  color: ${p => p.$danger ? '#e57373' : '#888'};
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 12px;
  cursor: pointer;
  &:hover { background: ${p => p.$danger ? '#5a2020' : '#2a2a4a'}; color: #fff; }
`

const Message = styled.div`color: #888; font-size: 15px; margin-top: 40px; text-align: center;`
