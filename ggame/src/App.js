import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './app/Home';
import PlayerCreate from './app/PlayerCreate';
import PlayerLogin from './app/PlayerLogin';
import Game from './app/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/PlayerCreate" element={<PlayerCreate />} />
  <Route path="/PlayerLogin" element={<PlayerLogin />} />
  <Route path="/Game" element={<Game />} />
  <Route path="/PlayerLogin" element={<PlayerLogin />} />
        {/* fallback to Home for unknown routes while developing */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
