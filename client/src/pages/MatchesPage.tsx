import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Modal, { Field, Label, Input, Select, FormActions, BtnPrimary, BtnSecondary } from '../components/Modal'

interface User {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

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

interface Meta {
  tournaments: { id: number; name: string; season: string }[]
  teams: { id: number; name: string }[]
  referees: { id: number; first_name: string; last_name: string }[]
}

const emptyForm = {
  tournament_id: '', home_team_id: '', away_team_id: '',
  match_date: '', home_score: '', away_score: '', referee_id: '',
}

export default function MatchesPage({ user }: { user: User }) {
  const [matches, setMatches] = useState<Match[]>([])
  const [meta, setMeta] = useState<Meta>({ tournaments: [], teams: [], referees: [] })
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Match | null>(null)
  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('/api/meta', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then(setMeta)
  }, [token])

  const load = (tournamentId: number | null) => {
    setLoading(true)
    const url = tournamentId ? `/api/matches?tournamentId=${tournamentId}` : '/api/matches'
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setMatches(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => { load(selectedTournament) }, [selectedTournament])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal('add') }

  const openEdit = (e: React.MouseEvent, m: Match) => {
    e.stopPropagation()
    setEditing(m)
    setForm({
      tournament_id: String(m.tournaments.id ?? ''),
      home_team_id: '',
      away_team_id: '',
      match_date: m.match_date ? m.match_date.slice(0, 10) : '',
      home_score: m.home_score !== null ? String(m.home_score) : '',
      away_score: m.away_score !== null ? String(m.away_score) : '',
      referee_id: '',
    })
    setModal('edit')
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm('Delete this match?')) return
    await fetch(`/api/matches/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load(selectedTournament)
  }

  const handleSubmit = async () => {
    const body = {
      tournament_id: Number(form.tournament_id),
      home_team_id: Number(form.home_team_id),
      away_team_id: Number(form.away_team_id),
      match_date: form.match_date,
      home_score: form.home_score !== '' ? Number(form.home_score) : null,
      away_score: form.away_score !== '' ? Number(form.away_score) : null,
      referee_id: form.referee_id ? Number(form.referee_id) : null,
    }
    if (modal === 'add') {
      await fetch('/api/matches', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    } else if (editing) {
      await fetch(`/api/matches/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    }
    setModal(null)
    load(selectedTournament)
  }

  const f = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  })

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
        {user.role === 'ADMIN' && <AddBtn onClick={openAdd}>+ Add Match</AddBtn>}
      </Header>

      <Filters>
        <FilterBtn $active={selectedTournament === null} onClick={() => setSelectedTournament(null)}>All</FilterBtn>
        {meta.tournaments.map((t) => (
          <FilterBtn key={t.id} $active={selectedTournament === t.id} onClick={() => setSelectedTournament(t.id)}>
            {t.name}
          </FilterBtn>
        ))}
      </Filters>

      {loading && <Message>Loading...</Message>}

      {Object.entries(grouped).map(([tournName, ms]) => (
        <Group key={tournName}>
          <GroupTitle>{tournName}</GroupTitle>
          <MatchList>
            {ms.map((m) => (
              <MatchRow key={m.id} onClick={() => navigate(`/matches/${m.id}`)}>
                <DateCol>
                  {new Date(m.match_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
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
                <RowActions onClick={(e) => e.stopPropagation()}>
                  {user.role === 'ADMIN' && (
                    <>
                      <ActionBtn onClick={(e) => openEdit(e, m)}>Edit</ActionBtn>
                      <ActionBtn $danger onClick={(e) => handleDelete(e, m.id)}>Del</ActionBtn>
                    </>
                  )}
                </RowActions>
              </MatchRow>
            ))}
          </MatchList>
        </Group>
      ))}

      {!loading && matches.length === 0 && <Message>No matches found</Message>}

      {modal && user.role === 'ADMIN' && (
        <Modal title={modal === 'add' ? 'Add Match' : 'Edit Match'} onClose={() => setModal(null)}>
          <Field>
            <Label>Tournament</Label>
            <Select {...f('tournament_id')}>
              <option value="">— Select —</option>
              {meta.tournaments.map((t) => <option key={t.id} value={t.id}>{t.name} {t.season}</option>)}
            </Select>
          </Field>
          <Field>
            <Label>Home Team</Label>
            <Select {...f('home_team_id')}>
              <option value="">— Select —</option>
              {meta.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field>
            <Label>Away Team</Label>
            <Select {...f('away_team_id')}>
              <option value="">— Select —</option>
              {meta.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field><Label>Date</Label><Input type="date" {...f('match_date')} /></Field>
          <Field><Label>Home Score</Label><Input type="number" {...f('home_score')} /></Field>
          <Field><Label>Away Score</Label><Input type="number" {...f('away_score')} /></Field>
          <Field>
            <Label>Referee (optional)</Label>
            <Select {...f('referee_id')}>
              <option value="">— None —</option>
              {meta.referees.map((r) => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}
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

const Page = styled.div`max-width: 900px; margin: 0 auto; padding: 32px 16px;`

const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;`

const Title = styled.h1`font-size: 24px; color: #fff; margin: 0;`

const AddBtn = styled.button`
  background: #4fc3f7; color: #0f0f1a; border: none; border-radius: 8px;
  padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer;
  &:hover { background: #81d4fa; }
`

const Filters = styled.div`display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;`

const FilterBtn = styled.button<{ $active: boolean }>`
  background: ${p => p.$active ? '#4fc3f7' : '#1a1a2e'};
  color: ${p => p.$active ? '#0f0f1a' : '#888'};
  border: 1px solid ${p => p.$active ? '#4fc3f7' : '#2a2a4a'};
  border-radius: 6px; padding: 6px 14px; font-size: 13px; cursor: pointer;
  font-weight: ${p => p.$active ? '600' : '400'}; transition: all 0.15s;
  &:hover { border-color: #4fc3f7; color: ${p => p.$active ? '#0f0f1a' : '#4fc3f7'}; }
`

const Group = styled.div`margin-bottom: 24px;`

const GroupTitle = styled.div`
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
  color: #4fc3f7; font-weight: 700; margin-bottom: 8px; padding: 0 4px;
`

const MatchList = styled.div`
  background: #1a1a2e; border: 1px solid #2a2a4a; border-radius: 10px; overflow: hidden;
`

const MatchRow = styled.div`
  display: flex; align-items: center; padding: 0 16px; height: 48px;
  cursor: pointer; gap: 12px; transition: background 0.12s;
  &:not(:last-child) { border-bottom: 1px solid #1f1f3a; }
  &:hover { background: #202040; }
`

const DateCol = styled.div`font-size: 12px; color: #4a4a6a; width: 60px; flex-shrink: 0; white-space: nowrap;`

const TeamsRow = styled.div`flex: 1; display: flex; align-items: center; gap: 12px; min-width: 0;`

const HomeTeam = styled.div`flex: 1; text-align: right; font-size: 14px; color: #d0d0d0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`

const AwayTeam = styled.div`flex: 1; text-align: left; font-size: 14px; color: #d0d0d0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`

const ScoreBadge = styled.div`
  display: flex; align-items: center; gap: 4px;
  background: #13132a; border: 1px solid #2a2a4a;
  border-radius: 6px; padding: 4px 10px; flex-shrink: 0;
`

const ScoreNum = styled.span`font-size: 15px; font-weight: 700; color: #fff; min-width: 14px; text-align: center;`

const ScoreSep = styled.span`font-size: 13px; color: #3a3a5a;`

const RefCol = styled.div`font-size: 12px; color: #3a3a5a; width: 100px; flex-shrink: 0; text-align: right; white-space: nowrap;`

const RowActions = styled.div`display: flex; gap: 6px; flex-shrink: 0;`

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: 1px solid ${p => p.$danger ? '#5a2020' : '#2a2a4a'};
  color: ${p => p.$danger ? '#e57373' : '#888'};
  border-radius: 5px; padding: 3px 8px; font-size: 12px; cursor: pointer;
  &:hover { background: ${p => p.$danger ? '#5a2020' : '#2a2a4a'}; color: #fff; }
`

const Message = styled.div`color: #888; font-size: 15px; text-align: center; margin-top: 40px;`
