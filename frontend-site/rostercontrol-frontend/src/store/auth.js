import { reactive } from "vue";

// Simple auth store to manage user state - using Vue reactivity
const state = reactive({
  currentUser: null,
});

export const authStore = {
  // Don't load from localStorage automatically - wait for backend verification
  init() {
    // Don't load from localStorage here - we'll verify with backend first
    // This prevents showing stale login state on page load
    state.currentUser = null;
  },

  // Set current user
  setUser(user) {
    state.currentUser = user;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    // Dispatch event for components that might be listening
    window.dispatchEvent(new Event("auth-change"));
  },

  // Get current user
  getUser() {
    return state.currentUser;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return state.currentUser !== null;
  },

  // Check if user is admin
  isAdmin() {
    return state.currentUser && state.currentUser.IsAdmin === true;
  },

  // Clear user (logout)
  clearUser() {
    state.currentUser = null;
    localStorage.removeItem("user");
    // Dispatch event for components that might be listening
    window.dispatchEvent(new Event("auth-change"));
  },

  // Get the reactive state (for direct access in components)
  getState() {
    return state;
  },
};

// Initialize on load
authStore.init();
