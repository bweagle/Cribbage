import { useState } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import { WelcomeView } from './views/WelcomeView.jsx';

function App() {
  const [currentView, setCurrentView] = useState('welcome');

  const handleStartGame = () => {
    // For now, just show an alert
    // In full implementation, this would navigate to lobby view
    alert('Game starting! Bluetooth functionality will be added next.');
    // setCurrentView('lobby');
  };

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onStartGame={handleStartGame} />;
      default:
        return <WelcomeView onStartGame={handleStartGame} />;
    }
  };

  return (
    <ErrorBoundary showDetails={true}>
      {renderView()}
    </ErrorBoundary>
  );
}

export default App;
