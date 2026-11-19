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

    // Create notification element: a small Win95-style window, matching the hub
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.setAttribute('role', 'status');
    notification.innerHTML = `
      <div class="ach-toast-title">Achievement Unlocked!</div>
      <div class="ach-toast-body">
        <span class="ach-toast-icon">${achievement.icon}</span>
        <div>
          <div class="ach-toast-name">${achievement.name}</div>
          <div class="ach-toast-description">${achievement.description}</div>
        </div>
      </div>
    `;

    // Add styles (scoped to the toast so they don't clash with a game's own styles)
    const styles = `
      .achievement-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        width: min(360px, calc(100vw - 40px));
        box-sizing: border-box;
        padding: 3px;
        background: #c0c0c0;
        color: #000;
        font-family: Tahoma, Verdana, "Segoe UI", sans-serif;
        box-shadow:
          inset -1px -1px #0a0a0a, inset 1px 1px #fff,
          inset -2px -2px #808080, inset 2px 2px #dfdfdf,
          4px 4px 0 rgba(0, 0, 0, 0.35);
        animation: achToastIn 0.25s steps(5), achToastOut 0.25s steps(5) 3.75s forwards;
      }

      .achievement-notification .ach-toast-title {
        padding: 3px 6px;
        background: linear-gradient(90deg, #000080, #1084d0);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
      }

      .achievement-notification .ach-toast-body {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 12px 10px 10px;
      }

      .achievement-notification .ach-toast-icon {
        flex-shrink: 0;
        font-size: 32px;
        line-height: 1;
      }

      .achievement-notification .ach-toast-name {
        margin-bottom: 2px;
        color: #000080;
        font-size: 15px;
        font-weight: 700;
      }

      .achievement-notification .ach-toast-description {
        font-size: 13px;
        line-height: 1.35;
      }

      @keyframes achToastIn {
        from { transform: translateY(140%); }
        to { transform: translateY(0); }
      }

      @keyframes achToastOut {
        from { transform: translateY(0); }
        to { transform: translateY(140%); }
      }

      @media (prefers-reduced-motion: reduce) {
        .achievement-notification { animation: none; }
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
