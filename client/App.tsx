import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RepoDisplay from './pages/RepoDisplay';
import DataDisplay from './pages/DataDisplay';
import { SelectedRepoProvider } from './components/SelectedRepoProvider';

const App: React.FC = () => {
  return (
    <div className="bg-blackGR min-h-screen top-0 z-0">
      <SelectedRepoProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/repodisplay" element={<RepoDisplay />} />
          <Route path="/bulletpoints" element={<DataDisplay />} />
        </Routes>
      </SelectedRepoProvider>
    </div>
  );
};

export default App;
