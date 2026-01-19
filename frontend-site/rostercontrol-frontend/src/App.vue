<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <template v-if="!isAuthenticated">
      <router-link to="/login">Login</router-link> |
      <router-link to="/signup">Sign Up</router-link> |
    </template>
    <template v-else>
      <span>Welcome, {{ userDisplayName }}!</span>
      <span v-if="isAdmin" class="admin-badge"> (Admin)</span> |
      <a href="#" @click.prevent="handleLogout">Logout</a> |
    </template>
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<script>
import { authStore } from "./store/auth";
import { apiService } from "./services/apiService";

export default {
  name: "App",
  data() {
    return {
      user: authStore.getUser(),
    };
  },
  computed: {
    isAuthenticated() {
      return authStore.isAuthenticated();
    },
    isAdmin() {
      return authStore.isAdmin();
    },
    userDisplayName() {
      return this.user ? this.user.DisplayName : "";
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
        this.user = null;
        this.$router.push("/login");
      }
    },
  },
  mounted() {
    // Check for user on mount
    this.user = authStore.getUser();
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
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.admin-badge {
  color: #f39c12;
  font-weight: bold;
  margin-left: 5px;
}

nav a {
  cursor: pointer;
  text-decoration: none;
}
</style>
