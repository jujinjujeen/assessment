import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import React from 'react';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const SeasonPage = React.lazy(() => import('./pages/SeasonPage'));

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
