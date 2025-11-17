<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <div class="dashboard-content">
      <div class="welcome-card">
        <h2>Welcome to Ranch Admin Panel</h2>
        <p>Manage your staff and resources efficiently.</p>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-grid">
          <router-link to="/staff" class="action-card">
            <div class="action-icon">👥</div>
            <h4>View Staff</h4>
            <p>Manage staff members</p>
          </router-link>

          <router-link to="/staff/create" class="action-card">
            <div class="action-icon">➕</div>
            <h4>Add Staff</h4>
            <p>Create new staff member</p>
          </router-link>
        </div>
      </div>

      <div v-if="user" class="user-info">
        <h3>Your Profile</h3>
        <div class="info-card">
          <p><strong>User ID:</strong> {{ user.id || 'N/A' }}</p>
          <p><strong>Email:</strong> {{ user.email || 'N/A' }}</p>
          <p><strong>Name:</strong> {{ user.name || 'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';
import apiService from '../services/apiService';

export default {
  name: 'DashboardView',
  setup() {
    const router = useRouter();
    const user = ref(null);

    const handleLogout = () => {
      authService.logout();
      router.push({ name: 'Login' });
    };

    const loadUserProfile = async () => {
      try {
        user.value = await apiService.getCurrentUser();
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    onMounted(() => {
      loadUserProfile();
    });

    return {
      user,
      handleLogout
    };
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.dashboard-header h1 {
  color: #333;
  font-size: 32px;
  margin: 0;
}

.logout-button {
  padding: 10px 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-button:hover {
  background: #c82333;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.welcome-card p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.quick-actions h3 {
  color: #333;
  font-size: 22px;
  margin-bottom: 20px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.action-card h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 20px;
}

.action-card p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.user-info h3 {
  color: #333;
  font-size: 22px;
  margin-bottom: 20px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card p {
  margin: 10px 0;
  color: #666;
  font-size: 16px;
}

.info-card strong {
  color: #333;
  margin-right: 10px;
}
</style>
