<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">RosterControl</h1>
      <h2 class="login-subtitle">Sign In</h2>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            class="form-input"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading" class="login-button">
          <span v-if="!isLoading">Sign In</span>
          <span v-else>Signing in...</span>
        </button>

        <div class="signup-link">
          Don't have an account?
          <router-link to="/signup">Sign up</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { apiService } from "../services/apiService";
import { authStore } from "../store/auth";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        const response = await apiService.login(this.email, this.password);

        // Store user info in auth store
        authStore.setUser(response);

        // Redirect to home page - the route change will trigger App.vue to update
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Login failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.login-subtitle {
  color: #7f8c8d;
  margin: 0 0 2rem 0;
  font-size: 1.2rem;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid #fcc;
}

.login-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background-color: #35a372;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.signup-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
