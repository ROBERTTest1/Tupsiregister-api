<template>
  <div id="app">
    <!-- User Status Indicator (Top Right Corner) -->
    <div class="user-status">
      <div v-if="isAuthenticated" class="status-indicator logged-in">
        <span class="status-dot"></span>
        <span class="status-text">
          Logged in as <strong>{{ userDisplayName }}</strong>
          <span v-if="isAdmin" class="admin-badge">(Admin)</span>
        </span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
      <div v-else class="status-indicator logged-out">
        <span class="status-dot"></span>
        <span class="status-text">Not logged in</span>
        <router-link to="/login" class="login-link-btn">Login</router-link>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav>
      <router-link to="/">Home</router-link> |
      <template v-if="!isAuthenticated">
        <router-link to="/login">Login</router-link> |
        <router-link to="/signup">Sign Up</router-link> |
      </template>
      <template v-else>
        <router-link to="/workers">Workers</router-link> |
        <a href="#" @click.prevent="handleLogout">Logout</a> |
      </template>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { authStore } from "./store/auth";
import { apiService } from "./services/apiService";

export default {
  name: "App",
  data() {
    return {
      // Access reactive state directly
      authState: authStore.getState(),
    };
  },
  computed: {
    isAuthenticated() {
      // Access reactive state - Vue will track changes
      return this.authState.currentUser !== null;
    },
    isAdmin() {
      return (
        this.authState.currentUser &&
        this.authState.currentUser.IsAdmin === true
      );
    },
    userDisplayName() {
      return this.authState.currentUser
        ? this.authState.currentUser.DisplayName
        : "";
    },
  },
  methods: {
    async handleLogout() {
      try {
        await apiService.logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        authStore.clearUser();
        this.$router.push("/login");
      }
    },
    async verifySession() {
      // Always check with backend first, don't trust localStorage
      try {
        const user = await apiService.getCurrentSession();
        // Backend has a valid session, use it (this will also update localStorage)
        authStore.setUser(user);
      } catch (error) {
        // No valid session on backend - clear everything
        console.log("No valid session, clearing user:", error.message);
        authStore.clearUser();
      }
    },
  },
  async mounted() {
    // Verify session on mount
    await this.verifySession();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  min-height: 100vh;
}

/* User Status Indicator - Top Right Corner */
.user-status {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: white;
  padding: 12px 18px;
  border-radius: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.logged-in .status-dot {
  background-color: #42b983;
  box-shadow: 0 0 6px rgba(66, 185, 131, 0.5);
}

.logged-out .status-dot {
  background-color: #e74c3c;
  box-shadow: 0 0 6px rgba(231, 76, 60, 0.5);
}

.status-text {
  color: #2c3e50;
  font-weight: 500;
}

.status-text strong {
  color: #42b983;
  font-weight: 600;
}

.admin-badge {
  color: #f39c12;
  font-weight: bold;
  margin-left: 5px;
}

.logout-btn,
.login-link-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.login-link-btn {
  background-color: #42b983;
}

.login-link-btn:hover {
  background-color: #35a372;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  cursor: pointer;
}

nav a.router-link-exact-active {
  color: #42b983;
}

nav a:hover {
  color: #42b983;
}
</style>
