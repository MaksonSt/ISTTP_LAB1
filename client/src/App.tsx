import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PlayersPage from './pages/PlayersPage'
import PlayerDetailPage from './pages/PlayerDetailPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import TournamentsPage from './pages/TournamentsPage'
import TournamentDetailPage from './pages/TournamentDetailPage'
import MatchesPage from './pages/MatchesPage'
import MatchDetailPage from './pages/MatchDetailPage'
import StatsPage from './pages/StatsPage'
import LoginPage from './pages/LoginPage'

interface User {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  if (loading) return <div />

  const handleLogin = (u: User) => {
    setUser(u)
    navigate('/players')
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    )
  }

  return (
    <>
      <Nav>
        <Logo>FootballHub</Logo>
        <NavLink to="/players">Players</NavLink>
        <NavLink to="/teams">Clubs</NavLink>
        <NavLink to="/tournaments">Tournaments</NavLink>
        <NavLink to="/matches">Matches</NavLink>
        <NavLink to="/stats">Stats</NavLink>
        <NavSpacer />
        <UserInfo>{user.email} ({user.role})</UserInfo>
        <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
      </Nav>
      <Main>
        <Routes>
          <Route path="/players" element={<PlayersPage user={user} />} />
          <Route path="/players/:id" element={<PlayerDetailPage />} />
          <Route path="/teams" element={<TeamsPage user={user} />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/tournaments" element={<TournamentsPage user={user} />} />
          <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="/matches" element={<MatchesPage user={user} />} />
          <Route path="/matches/:id" element={<MatchDetailPage />} />
          <Route path="/stats" element={<StatsPage user={user} />} />
          <Route path="/" element={<PlayersPage user={user} />} />
        </Routes>
      </Main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

const Nav = styled.nav`
  background: #1a1a2e;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 60px;
`

const NavLink = styled(Link)`
  color: #e0e0e0;
  text-decoration: none;
  font-size: 15px;
  &:hover { color: #4fc3f7; }
`

const Logo = styled.span`
  color: #4fc3f7;
  font-weight: 700;
  font-size: 20px;
  margin-right: 16px;
`

const NavSpacer = styled.div`
  flex: 1;
`

const UserInfo = styled.span`
  color: #888;
  font-size: 13px;
`

const LogoutBtn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #2a2a4a;
  background: transparent;
  color: #e0e0e0;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: #2a2a4a;
    color: #fff;
  }
`

const Main = styled.main`
  min-height: calc(100vh - 60px);
  background: #0f0f1a;
  color: #e0e0e0;
`

export default App
