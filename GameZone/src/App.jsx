import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { WeeklyChallenge } from './components/WeeklyChallenge';
import { Leaderboard } from './components/Leaderboard';
import { MemoryGame } from './components/MemoryGame';
import { TouchTypingGame } from './components/TouchTypingGame';

function AppShell() {
  const location = useLocation();
  const isGameRoute = location.pathname.startsWith('/games/');

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface" dir="rtl">
      <Header hideNavigation={isGameRoute} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weekly-challenge" element={<WeeklyChallenge />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/games/memory" element={<MemoryGame />} />
        <Route path="/games/touch-typing" element={<TouchTypingGame />} />
      </Routes>
      {!isGameRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}

export default App
