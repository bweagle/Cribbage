import { useState } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import { WelcomeView } from './views/WelcomeView.jsx';
import { LobbyView } from './views/LobbyView.jsx';
import { DemoView } from './views/DemoView.jsx';

function App() {
  const [currentView, setCurrentView] = useState('welcome');

  const handleStartGame = () => {
    setCurrentView('lobby');
  };

  const handleGameReady = (connection, role) => {
    // When Bluetooth connection is established, start game
    setCurrentView('game');
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
  };

  const handleViewDemo = () => {
    setCurrentView('demo');
  };

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onStartGame={handleStartGame} onViewDemo={handleViewDemo} />;
      case 'lobby':
        return (
          <LobbyView
            onGameReady={handleGameReady}
            onBack={handleBackToWelcome}
          />
        );
      case 'demo':
        return <DemoView onBack={handleBackToWelcome} />;
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
