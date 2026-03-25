import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import PlayersPage from './pages/PlayersPage'
import PlayerDetailPage from './pages/PlayerDetailPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import TournamentsPage from './pages/TournamentsPage'
import TournamentDetailPage from './pages/TournamentDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Nav>
        <Logo>FootballHub</Logo>
        <NavLink to="/players">Players</NavLink>
        <NavLink to="/teams">Clubs</NavLink>
        <NavLink to="/tournaments">Tournaments</NavLink>
      </Nav>
      <Main>
        <Routes>
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/players/:id" element={<PlayerDetailPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="/" element={<PlayersPage />} />
        </Routes>
      </Main>
    </BrowserRouter>
  )
}

export default App

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

const Main = styled.main`
  min-height: calc(100vh - 60px);
  background: #0f0f1a;
  color: #e0e0e0;
`
