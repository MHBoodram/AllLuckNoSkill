import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './app/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* fallback to Home for unknown routes while developing */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
