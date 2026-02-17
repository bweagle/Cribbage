// localStorage keys
const KEYS = {
  GAME_STATE: 'cribbage_game_state',
  SETTINGS: 'cribbage_settings',
};

// Save game state to localStorage
export function saveGameState(gameState) {
  try {
    const data = {
      ...gameState,
      savedAt: Date.now(),
    };
    localStorage.setItem(KEYS.GAME_STATE, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
}

// Load game state from localStorage
export function loadGameState() {
  try {
    const saved = localStorage.getItem(KEYS.GAME_STATE);
    if (!saved) return null;

    const state = JSON.parse(saved);

    // Discard if older than 1 hour
    const ONE_HOUR = 3600000;
    if (Date.now() - state.savedAt > ONE_HOUR) {
      localStorage.removeItem(KEYS.GAME_STATE);
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

// Clear saved game state
export function clearGameState() {
  try {
    localStorage.removeItem(KEYS.GAME_STATE);
    return true;
  } catch (error) {
    console.error('Failed to clear game state:', error);
    return false;
  }
}

// Save user settings
export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

// Load user settings
export function loadSettings() {
  try {
    const saved = localStorage.getItem(KEYS.SETTINGS);
    if (!saved) {
      return {
        soundEnabled: true,
        muteAll: false,
      };
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      soundEnabled: true,
      muteAll: false,
    };
  }
}
