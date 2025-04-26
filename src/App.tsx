import { Route, Routes } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/navbar'
import { Home } from './pages/home'
import { Place } from './pages/place'
import { GameDetail } from './pages/game_detail'
import { RoundDetail } from './pages/round_detail'
import { PlayerDetail } from './pages/player_detail'
import { PlayerList } from './pages/player_list'
import { NotFound } from './pages/not_found'

function App() {
  return (
    <div className='grid grid-cols-8'>
      <div className="col-span-6 col-start-2">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/:game_id" element={<GameDetail />} />
          <Route path="/rounds/:round_id" element={<RoundDetail />} />
          <Route path="/place" element={<Place />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/players/:player_id" element={<PlayerDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>      
      </div>
    </div>
  )
}

export default App
