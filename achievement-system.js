/**
 * Shared Achievement System for Game Portfolio
 * 
 * Usage in your games:
 *   1. Include in your HTML: <script src="../../achievement-system.js"></script>
 *   2. Initialize: AchievementSystem.init('game-name');
 *   3. Unlock: AchievementSystem.unlock('achievement-id');
 * 
 * Achievements are stored in localStorage and shared across all games.
 */

const AchievementSystem = (() => {
  const STORAGE_KEY = 'game_portfolio_achievements';
  const UNLOCK_EVENT = 'achievement-unlocked';
  let currentGame = null;

  /**
   * Initialize the achievement system for a specific game
   */
  function init(gameName) {
    currentGame = gameName;
    ensureStorageExists();
  }

  /**
   * Ensure the storage structure exists
   */
  function ensureStorageExists() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        unlocked: {},
        unlockedAt: {},
        stats: {
          totalUnlocked: 0,
          lastUnlocked: null
        }
      }));
    }
  }

  /**
   * Register achievements for a game
   * Should be called at game initialization
   * 
   * @param {string} gameName - Name of the game
   * @param {Array} achievements - Array of achievement objects
   * 
   * Example:
   *   AchievementSystem.register('the-arena', [
   *     { id: 'first-win', name: 'First Victory', description: 'Win your first debate', icon: '🏆' },
   *     { id: 'speedrunner', name: 'Speed Runner', description: 'Complete in under 2 minutes', icon: '⚡' }
   *   ]);
   */
  function register(gameName, achievements) {
    const data = getStorage();
    
    achievements.forEach(achievement => {
      const fullId = `${gameName}:${achievement.id}`;
      
      // Initialize unlocked status if not exists
      if (!(fullId in data.unlocked)) {
        data.unlocked[fullId] = false;
      }
      
      // Store achievement metadata
      if (!data[fullId]) {
        data[fullId] = {
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon || '🎮',
          game: gameName,
          points: achievement.points || 10,
          rarity: achievement.rarity || 'common' // common, uncommon, rare, legendary
        };
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Unlock an achievement
   * 
   * @param {string} achievementId - The achievement ID (without game name)
   * @returns {boolean} - True if newly unlocked, false if already unlocked
   */
  function unlock(achievementId) {
    if (!currentGame) {
      console.warn('AchievementSystem not initialized. Call init() first.');
      return false;
    }

    const fullId = `${currentGame}:${achievementId}`;
    const data = getStorage();

    // If already unlocked, return false
    if (data.unlocked[fullId]) {
      return false;
    }

    // Unlock the achievement
    data.unlocked[fullId] = true;
    data.unlockedAt[fullId] = new Date().toISOString();
    data.stats.totalUnlocked += 1;
    data.stats.lastUnlocked = fullId;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent(UNLOCK_EVENT, {
      detail: { achievementId: fullId, game: currentGame }
    }));

    // Optional: Show a notification
    showUnlockNotification(fullId);

    return true;
  }

  /**
   * Check if an achievement is unlocked
   */
  function isUnlocked(achievementId) {
    const fullId = `${currentGame}:${achievementId}`;
    const data = getStorage();
    return data.unlocked[fullId] || false;
  }

  /**
   * Get all achievements for a specific game or all games
   * 
   * @param {string} gameName - Optional: filter by game name
   * @returns {Array} - Array of achievement objects with unlock status
   */
  function getAchievements(gameName) {
    const data = getStorage();
    const achievements = [];

    Object.keys(data.unlocked).forEach(fullId => {
      const [game, id] = fullId.split(':');
      
      if (gameName && game !== gameName) return;

      const achievementData = data[fullId];
      if (achievementData) {
        achievements.push({
          id: id,
          fullId: fullId,
          game: game,
          name: achievementData.name,
          description: achievementData.description,
          icon: achievementData.icon,
          points: achievementData.points,
          rarity: achievementData.rarity,
          unlocked: data.unlocked[fullId],
          unlockedAt: data.unlockedAt[fullId] || null
        });
      }
    });

    return achievements;
  }

  /**
   * Get achievement statistics
   */
  function getStats() {
    const data = getStorage();
    const achievements = getAchievements();
    
    const unlockedCount = Object.values(data.unlocked).filter(v => v).length;
    const totalCount = achievements.length;
    const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0);

    return {
      totalUnlocked: unlockedCount,
      totalAchievements: totalCount,
      unlockedPercentage: totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0,
      totalPoints: totalPoints,
      lastUnlockedAt: data.stats.lastUnlocked ? formatDate(data.unlockedAt[data.stats.lastUnlocked]) : null
    };
  }

  /**
   * Get achievements grouped by game
   */
  function getAchievementsByGame() {
    const achievements = getAchievements();
    const grouped = {};

    achievements.forEach(achievement => {
      if (!grouped[achievement.game]) {
        grouped[achievement.game] = [];
      }
      grouped[achievement.game].push(achievement);
    });

    return grouped;
  }

  /**
   * Reset all achievements (use with caution!)
   */
  function reset() {
    if (confirm('Are you sure you want to reset all achievements? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      ensureStorageExists();
      window.dispatchEvent(new CustomEvent('achievements-reset'));
    }
  }

  /**
   * Get the raw storage data
   */
  function getStorage() {
    ensureStorageExists();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  /**
   * Show a visual notification when achievement is unlocked
   */
  function showUnlockNotification(fullId) {
    const data = getStorage();
    const achievement = data[fullId];

    if (!achievement) return;

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notification-content">
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-info">
          <div class="achievement-unlocked-text">Achievement Unlocked!</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      </div>
    `;

    // Add styles
    const styles = `
      .achievement-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.4s ease-out, slideOut 0.4s ease-in 3.6s forwards;
        z-index: 10000;
        max-width: 400px;
      }

      .achievement-notification-content {
        display: flex;
        gap: 15px;
        align-items: flex-start;
      }

      .achievement-icon {
        font-size: 2.5em;
        flex-shrink: 0;
      }

      .achievement-info {
        flex: 1;
      }

      .achievement-unlocked-text {
        font-size: 0.85em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.9;
      }

      .achievement-name {
        font-size: 1.2em;
        font-weight: bold;
        margin: 5px 0;
      }

      .achievement-description {
        font-size: 0.85em;
        opacity: 0.85;
        margin-top: 3px;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;

    // Inject styles if not already present
    if (!document.querySelector('style[data-achievement-styles]')) {
      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-achievement-styles', 'true');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    // Add to body
    document.body.appendChild(notification);

    // Remove after animation
    setTimeout(() => notification.remove(), 4000);
  }

  /**
   * Format date nicely
   */
  function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Listen for achievement unlocks (for real-time UI updates)
   */
  function onUnlock(callback) {
    window.addEventListener(UNLOCK_EVENT, callback);
  }

  // Public API
  return {
    init,
    register,
    unlock,
    isUnlocked,
    getAchievements,
    getStats,
    getAchievementsByGame,
    reset,
    onUnlock,
    formatDate
  };
})();

// Auto-inject styles on load
document.addEventListener('DOMContentLoaded', () => {
  // Additional styles can be injected here if needed
});
