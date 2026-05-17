import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisComplete = (data) => {
    console.log('Analysis complete, received data:', data);
    setAnalysisData(data);
  };

  const handleReset = () => {
    setAnalysisData(null);
  };

  return analysisData ? (
    <Dashboard analysisData={analysisData} onReset={handleReset} />
  ) : (
    <LandingPage onAnalysisComplete={handleAnalysisComplete} />
  );
}