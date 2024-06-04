import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RepoDisplay from './pages/RepoDisplay';

const App: React.FC = () => {
  return (
    <div className="bg-blackGR h-screen top-0 z-0">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/repodisplay" element={<RepoDisplay />} />
      </Routes>
    </div>
  );
};

export default App;
