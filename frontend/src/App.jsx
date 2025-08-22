import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './contexts/SessionContext';
import { AffinityProvider } from './contexts/AffinityContext';
import { CooperativeRankingProvider } from './contexts/CooperativeRankingContext';

// Componentes de páginas
import LandingPage from './pages/LandingPage';
import GameSelection from './pages/GameSelection';
import PlanetExploration from './pages/PlanetExploration';

function App() {
  return (
    <SessionProvider>
      <AffinityProvider>
        <CooperativeRankingProvider>
          <div className="min-h-screen bg-black relative">
            {/* Overlay de estrellas como en la imagen */}
            <div className="stars-overlay"></div>
            
            <main className="flex-1 relative z-10">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/games" element={<GameSelection />} />
                <Route path="/planet/:planetKey" element={<PlanetExploration />} />
              </Routes>
            </main>
          </div>
        </CooperativeRankingProvider>
      </AffinityProvider>
    </SessionProvider>
  );
}

export default App;
