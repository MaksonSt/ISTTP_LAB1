import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Modal, { Field, Label, Input, Select, FormActions, BtnPrimary, BtnSecondary } from '../components/Modal'

interface Tournament {
  id: number
  name: string
  season: string
  start_date: string | null
  end_date: string | null
  tournament_countries: { name: string }
  _count: { tournament_teams: number; matches: number }
}

interface Meta {
  countries: { id: number; name: string }[]
}

const emptyForm = { name: '', season: '', start_date: '', end_date: '', country_id: '' }

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta>({ countries: [] })
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Tournament | null>(null)
  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()

  const load = () => {
    fetch('/api/tournaments')
      .then((r) => r.json())
      .then((data) => { setTournaments(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => {
    fetch('/api/meta').then((r) => r.json()).then(setMeta)
  }, [])

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal('add') }

  const openEdit = (e: React.MouseEvent, t: Tournament) => {
    e.stopPropagation()
    setEditing(t)
    setForm({
      name: t.name,
      season: t.season,
      start_date: t.start_date ? t.start_date.slice(0, 10) : '',
      end_date: t.end_date ? t.end_date.slice(0, 10) : '',
      country_id: '',
    })
    setModal('edit')
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm('Delete this tournament?')) return
    await fetch(`/api/tournaments/${id}`, { method: 'DELETE' })
    load()
  }

  const handleSubmit = async () => {
    const body = {
      name: form.name,
      season: form.season,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      country_id: Number(form.country_id),
    }
    if (modal === 'add') {
      await fetch('/api/tournaments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else if (editing) {
      await fetch(`/api/tournaments/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
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
        <Title>Tournaments</Title>
        <AddBtn onClick={openAdd}>+ Add Tournament</AddBtn>
      </Header>

      {loading && <Message>Loading...</Message>}

      <Grid>
        {tournaments.map((t) => (
          <Card key={t.id} onClick={() => navigate(`/tournaments/${t.id}`)}>
            <CardTop>
              <CardName>{t.name}</CardName>
              <CardActions>
                <ActionBtn onClick={(e) => openEdit(e, t)}>Edit</ActionBtn>
                <ActionBtn $danger onClick={(e) => handleDelete(e, t.id)}>Del</ActionBtn>
              </CardActions>
            </CardTop>
            <CardSeason>{t.season}</CardSeason>
            <CardMeta>
              <MetaItem>{t.tournament_countries.name}</MetaItem>
              <MetaItem>{t._count.tournament_teams} clubs</MetaItem>
              <MetaItem>{t._count.matches} matches</MetaItem>
            </CardMeta>
            {(t.start_date || t.end_date) && (
              <CardDates>
                {t.start_date ? new Date(t.start_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : '?'}
                {' — '}
                {t.end_date ? new Date(t.end_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) : '?'}
              </CardDates>
            )}
          </Card>
        ))}
      </Grid>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Tournament' : 'Edit Tournament'} onClose={() => setModal(null)}>
          <Field><Label>Name</Label><Input {...f('name')} /></Field>
          <Field><Label>Season (e.g. 2024/25)</Label><Input {...f('season')} /></Field>
          <Field>
            <Label>Country</Label>
            <Select {...f('country_id')}>
              <option value="">— Select —</option>
              {meta.countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field><Label>Start Date</Label><Input type="date" {...f('start_date')} /></Field>
          <Field><Label>End Date</Label><Input type="date" {...f('end_date')} /></Field>
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
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
`

const Title = styled.h1`font-size: 24px; color: #fff; margin: 0;`

const AddBtn = styled.button`
  background: #4fc3f7; color: #0f0f1a; border: none; border-radius: 8px;
  padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer;
  &:hover { background: #81d4fa; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`

const Card = styled.div`
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 20px 24px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover { background: #202040; border-color: #4fc3f7; }
`

const CardTop = styled.div`display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px;`

const CardName = styled.div`font-size: 17px; font-weight: 700; color: #fff;`

const CardActions = styled.div`display: flex; gap: 6px; flex-shrink: 0;`

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: 1px solid ${p => p.$danger ? '#5a2020' : '#2a2a4a'};
  color: ${p => p.$danger ? '#e57373' : '#888'};
  border-radius: 5px; padding: 3px 8px; font-size: 12px; cursor: pointer;
  &:hover { background: ${p => p.$danger ? '#5a2020' : '#2a2a4a'}; color: #fff; }
`

const CardSeason = styled.div`font-size: 13px; color: #4fc3f7; margin-bottom: 12px;`

const CardMeta = styled.div`display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 10px;`

const MetaItem = styled.span`font-size: 13px; color: #888;`

const CardDates = styled.div`font-size: 12px; color: #555;`

const Message = styled.div`color: #888; font-size: 15px; margin-top: 40px; text-align: center;`
