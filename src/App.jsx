import { useState } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import { WelcomeView } from './views/WelcomeView.jsx';
import { LobbyView } from './views/LobbyView.jsx';
import { DemoView } from './views/DemoView.jsx';
import { GameView } from './views/GameView.jsx';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [gameConnection, setGameConnection] = useState(null);
  const [gameRole, setGameRole] = useState(null);

  const handleStartGame = () => {
    setCurrentView('lobby');
  };

  const handleGameReady = (connection, role) => {
    // When Bluetooth connection is established, start game
    setGameConnection(connection);
    setGameRole(role);
    setCurrentView('game');
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setGameConnection(null);
    setGameRole(null);
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
      case 'game':
        return (
          <GameView
            connection={gameConnection}
            role={gameRole}
            onBack={handleBackToWelcome}
          />
        );
      default:
        return <WelcomeView onStartGame={handleStartGame} onViewDemo={handleViewDemo} />;
    }
  };

  return (
    <ErrorBoundary showDetails={true}>
      {renderView()}
    </ErrorBoundary>
  );
}

export default App;
