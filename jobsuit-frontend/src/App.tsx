import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { JobsPage } from './components/JobsPage';
import { CandidatesPage } from './components/CandidatesPage';
import { ScreeningPage } from './components/ScreeningPage';
import { ShortlistedPage } from './components/ShortlistedPage';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preselectedJobId, setPreselectedJobId] = useState<string | undefined>(undefined);

  const handleStartScreening = () => {
    setShowLanding(false);
    setActiveTab('dashboard');
  };

  const handleNavigateToScreen = (jobId: string) => {
    setPreselectedJobId(jobId);
    setActiveTab('screening');
  };

  const handleClearPreselectedJob = () => {
    setPreselectedJobId(undefined);
  };

  if (showLanding) {
    return <LandingPage onStart={handleStartScreening} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'jobs' && (
        <JobsPage onNavigateToScreen={handleNavigateToScreen} />
      )}
      {activeTab === 'candidates' && <CandidatesPage />}
      {activeTab === 'screening' && (
        <ScreeningPage 
          preselectedJobId={preselectedJobId} 
          onClearPreselectedJob={handleClearPreselectedJob} 
        />
      )}
      {activeTab === 'shortlisted' && <ShortlistedPage />}
      {activeTab === 'settings' && <SettingsPage />}
    </Layout>
  );
}

export default App;
