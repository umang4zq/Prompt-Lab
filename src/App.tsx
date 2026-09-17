import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CinematicHero from './app/(marketing)/page';
import { ThemeProvider } from './lib/theme/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<CinematicHero />} />
      </Routes>
    </ThemeProvider>
  );
}
