<template>
  <div class="signup-container">
    <div class="signup-card">
      <h1 class="signup-title">RosterControl</h1>
      <h2 class="signup-subtitle">Create Account</h2>

      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-group">
          <label for="displayName">Display Name</label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            placeholder="Enter your name"
            required
            class="form-input"
          />
        </div>

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
            minlength="6"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            class="form-input"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" :disabled="isLoading" class="signup-button">
          <span v-if="!isLoading">Sign Up</span>
          <span v-else>Creating account...</span>
        </button>

        <div class="login-link">
          Already have an account?
          <router-link to="/login">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { apiService } from "../services/apiService";

export default {
  name: "SignupView",
  data() {
    return {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      successMessage: "",
      isLoading: false,
    };
  },
  methods: {
    async handleSignup() {
      this.errorMessage = "";
      this.successMessage = "";
      this.isLoading = true;

      // Validation
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        this.isLoading = false;
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters long.";
        this.isLoading = false;
        return;
      }

      try {
        await apiService.signup(this.email, this.password, this.displayName);

        this.successMessage =
          "Account created successfully! Redirecting to login...";
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Signup error:", error);
        // Handle different types of errors
        if (
          error.message.includes("Network error") ||
          error.message.includes("Failed to fetch")
        ) {
          this.errorMessage =
            "Cannot connect to server. Please make sure the backend API is running on http://localhost:8080";
        } else {
          this.errorMessage =
            error.message ||
            "Signup failed. Please check your connection and try again.";
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.signup-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.signup-title {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.signup-subtitle {
  color: #7f8c8d;
  margin: 0 0 2rem 0;
  font-size: 1.2rem;
  font-weight: 400;
}

.signup-form {
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

.success-message {
  background-color: #efe;
  color: #3c3;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid #cfc;
}

.signup-button {
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

.signup-button:hover:not(:disabled) {
  background-color: #35a372;
}

.signup-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
