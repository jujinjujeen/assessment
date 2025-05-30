import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import { Home } from './pages/Home';
import { Season } from './pages/Season';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/season">
        <Route path=":seasonId" element={<Season />} />
        <Route index element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
