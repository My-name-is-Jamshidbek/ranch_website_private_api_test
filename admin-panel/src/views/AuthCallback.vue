<template>
  <div class="callback-container">
    <div class="callback-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <h2>Processing authentication...</h2>
        <p>Please wait while we complete your login.</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h2>Authentication Failed</h2>
        <p>{{ error }}</p>
        <button @click="redirectToLogin" class="retry-button">
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '../services/authService';

export default {
  name: 'AuthCallback',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(true);
    const error = ref('');

    const redirectToLogin = () => {
      router.push({ name: 'Login' });
    };

    onMounted(async () => {
      try {
        const code = route.query.code;
        const state = route.query.state;

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        await authService.handleCallback(code, state);
        
        // Redirect to dashboard on success
        router.push({ name: 'Dashboard' });
      } catch (err) {
        console.error('OAuth callback error:', err);
        error.value = err.message || 'An error occurred during authentication';
        loading.value = false;
      }
    });

    return {
      loading,
      error,
      redirectToLogin
    };
  }
};
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 60px 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.loading-state h2 {
  color: #333;
  margin: 20px 0 10px 0;
  font-size: 24px;
}

.loading-state p {
  color: #666;
  margin: 0;
  font-size: 16px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #333;
}

.error-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.error-state h2 {
  margin: 20px 0 10px 0;
  font-size: 24px;
  color: #c33;
}

.error-state p {
  color: #666;
  margin: 0 0 30px 0;
  font-size: 16px;
  line-height: 1.6;
}

.retry-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.retry-button:active {
  transform: translateY(0);
}
</style>
