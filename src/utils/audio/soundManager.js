// Sound manager for game audio
class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
    this.volume = 0.5;
  }

  // Preload a sound
  loadSound(name, url) {
    const audio = new Audio(url);
    audio.volume = this.volume;
    audio.preload = 'auto';
    this.sounds[name] = audio;
  }

  // Play a sound
  play(name) {
    if (this.muted) return;

    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    // Clone the audio to allow overlapping plays
    const clone = sound.cloneNode();
    clone.volume = this.volume;
    clone.play().catch((error) => {
      console.warn('Audio play failed:', error);
    });
  }

  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.volume;
    });
  }

  // Mute/unmute all sounds
  setMuted(muted) {
    this.muted = muted;
  }

  // Toggle mute
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

// Sound effects to load (URLs can be updated when actual sound files are added)
export function initializeSounds() {
  // For now, these are placeholders
  // When you add actual sound files to public/assets/sounds/, update these paths
  soundManager.loadSound('card-deal', '/assets/sounds/card-deal.mp3');
  soundManager.loadSound('card-play', '/assets/sounds/card-play.mp3');
  soundManager.loadSound('score-point', '/assets/sounds/score-point.mp3');
  soundManager.loadSound('call-go', '/assets/sounds/call-go.mp3');
  soundManager.loadSound('game-win', '/assets/sounds/game-win.mp3');
}

// Export sound functions
export function playCardDeal() {
  soundManager.play('card-deal');
}

export function playCardPlay() {
  soundManager.play('card-play');
}

export function playScorePoint() {
  soundManager.play('score-point');
}

export function playCallGo() {
  soundManager.play('call-go');
}

export function playGameWin() {
  soundManager.play('game-win');
}

export function setVolume(volume) {
  soundManager.setVolume(volume);
}

export function setMuted(muted) {
  soundManager.setMuted(muted);
}

export function toggleMute() {
  return soundManager.toggleMute();
}

export default soundManager;
