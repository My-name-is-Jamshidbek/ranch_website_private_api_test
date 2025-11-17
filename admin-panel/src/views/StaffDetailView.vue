<template>
  <div class="staff-detail">
    <div class="page-header">
      <h1>Staff Details</h1>
      <div class="header-actions">
        <router-link :to="`/staff/${staffId}/edit`" class="btn btn-primary">
          ✏️ Edit
        </router-link>
        <router-link to="/staff" class="btn btn-secondary">
          ← Back to List
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading staff details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadStaff" class="btn btn-primary">Retry</button>
    </div>

    <div v-else-if="staff" class="staff-content">
      <div class="detail-card">
        <div class="detail-section">
          <h3>Basic Information</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <label>ID:</label>
              <span>{{ staff.id }}</span>
            </div>
            <div class="detail-item">
              <label>Name:</label>
              <span>{{ staff.name || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Email:</label>
              <span>{{ staff.email || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Phone:</label>
              <span>{{ staff.phone || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Position:</label>
              <span>{{ staff.position || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Department:</label>
              <span>{{ staff.department || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Status:</label>
              <span :class="['status-badge', staff.status]">
                {{ staff.status || 'active' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="staff.created_at || staff.updated_at" class="detail-section">
          <h3>Timestamps</h3>
          <div class="detail-grid">
            <div v-if="staff.created_at" class="detail-item">
              <label>Created At:</label>
              <span>{{ formatDate(staff.created_at) }}</span>
            </div>
            <div v-if="staff.updated_at" class="detail-item">
              <label>Updated At:</label>
              <span>{{ formatDate(staff.updated_at) }}</span>
            </div>
          </div>
        </div>

        <div v-if="staff.bio || staff.notes" class="detail-section">
          <h3>Additional Information</h3>
          <div class="detail-item" v-if="staff.bio">
            <label>Bio:</label>
            <p>{{ staff.bio }}</p>
          </div>
          <div class="detail-item" v-if="staff.notes">
            <label>Notes:</label>
            <p>{{ staff.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiService from '../services/apiService';

export default {
  name: 'StaffDetailView',
  setup() {
    const route = useRoute();
    const staff = ref(null);
    const loading = ref(true);
    const error = ref('');
    
    const staffId = computed(() => route.params.id);

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleString();
      } catch {
        return dateString;
      }
    };

    const loadStaff = async () => {
      try {
        loading.value = true;
        error.value = '';
        staff.value = await apiService.getStaff(staffId.value);
      } catch (err) {
        console.error('Failed to load staff:', err);
        error.value = 'Failed to load staff details. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadStaff();
    });

    return {
      staff,
      loading,
      error,
      staffId,
      formatDate,
      loadStaff
    };
  }
};
</script>

<style scoped>
.staff-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h1 {
  color: #333;
  font-size: 32px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
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

.detail-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h3 {
  color: #333;
  font-size: 20px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item label {
  color: #666;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span,
.detail-item p {
  color: #333;
  font-size: 16px;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  width: fit-content;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}
</style>
