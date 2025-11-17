<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Ranch Admin Panel</h1>
        <p>Staff Management System</p>
      </div>
      
      <div class="login-content">
        <p class="login-description">
          Please sign in with your OAuth2 credentials to access the admin panel.
        </p>
        
        <button 
          @click="handleLogin" 
          class="login-button"
          :disabled="loading"
        >
          <span v-if="!loading">Sign in with OAuth2</span>
          <span v-else>Redirecting...</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import authService from '../services/authService';

export default {
  name: 'LoginView',
  setup() {
    const loading = ref(false);
    const error = ref('');

    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = '';
        await authService.initiateLogin();
      } catch (err) {
        error.value = 'Failed to initiate login. Please try again.';
        console.error('Login error:', err);
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.login-content {
  padding: 40px 30px;
}

.login-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background-color: #fee;
  color: #c33;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}
</style>
