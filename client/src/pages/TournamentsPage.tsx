import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

interface Tournament {
  id: number
  name: string
  season: string
  start_date: string | null
  end_date: string | null
  tournament_countries: { name: string }
  _count: { tournament_teams: number; matches: number }
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/tournaments')
      .then((r) => r.json())
      .then((data) => { setTournaments(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <Page>
      <Title>Tournaments</Title>
      {loading && <Message>Loading...</Message>}
      <Grid>
        {tournaments.map((t) => (
          <Card key={t.id} onClick={() => navigate(`/tournaments/${t.id}`)}>
            <CardName>{t.name}</CardName>
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
  margin: 0 0 24px;
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
  &:hover {
    background: #202040;
    border-color: #4fc3f7;
  }
`

const CardName = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`

const CardSeason = styled.div`
  font-size: 13px;
  color: #4fc3f7;
  margin-bottom: 12px;
`

const CardMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`

const MetaItem = styled.span`
  font-size: 13px;
  color: #888;
`

const CardDates = styled.div`
  font-size: 12px;
  color: #555;
`

const Message = styled.div`
  color: #888;
  font-size: 15px;
  margin-top: 40px;
  text-align: center;
`
