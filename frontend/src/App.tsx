import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import { HomePage } from './pages/HomePage';
import { SeasonPage } from './pages/SeasonPage';

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/season/:seasonId" element={<SeasonPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
