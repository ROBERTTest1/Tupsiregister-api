// Simple auth store to manage user state
let currentUser = null;

export const authStore = {
  // Load user from localStorage on init
  init() {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("user");
      }
    }
  },

  // Set current user
  setUser(user) {
    currentUser = user;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },

  // Get current user
  getUser() {
    return currentUser;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return currentUser !== null;
  },

  // Check if user is admin
  isAdmin() {
    return currentUser && currentUser.IsAdmin === true;
  },

  // Clear user (logout)
  clearUser() {
    currentUser = null;
    localStorage.removeItem("user");
  },
};

// Initialize on load
authStore.init();
