<template>
  <div class="staff-list">
    <div class="page-header">
      <h1>Staff Management</h1>
      <div class="header-actions">
        <router-link to="/staff/create" class="btn btn-primary">
          ➕ Add Staff Member
        </router-link>
        <router-link to="/" class="btn btn-secondary">
          ← Back to Dashboard
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading staff members...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadStaff" class="btn btn-primary">Retry</button>
    </div>

    <div v-else class="staff-content">
      <div v-if="staffList.length === 0" class="empty-state">
        <p>No staff members found.</p>
        <router-link to="/staff/create" class="btn btn-primary">
          Add First Staff Member
        </router-link>
      </div>

      <div v-else class="staff-table-container">
        <table class="staff-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="staff in staffList" :key="staff.id">
              <td>{{ staff.id }}</td>
              <td>{{ staff.name || 'N/A' }}</td>
              <td>{{ staff.email || 'N/A' }}</td>
              <td>{{ staff.position || 'N/A' }}</td>
              <td>
                <span :class="['status-badge', staff.status]">
                  {{ staff.status || 'active' }}
                </span>
              </td>
              <td class="actions-cell">
                <router-link 
                  :to="`/staff/${staff.id}`" 
                  class="action-btn view"
                  title="View Details"
                >
                  👁️
                </router-link>
                <router-link 
                  :to="`/staff/${staff.id}/edit`" 
                  class="action-btn edit"
                  title="Edit"
                >
                  ✏️
                </router-link>
                <button 
                  @click="confirmDelete(staff)" 
                  class="action-btn delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete <strong>{{ staffToDelete?.name }}</strong>?</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-secondary">Cancel</button>
          <button @click="deleteStaff" class="btn btn-danger" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService';

export default {
  name: 'StaffListView',
  setup() {
    const staffList = ref([]);
    const loading = ref(true);
    const error = ref('');
    const showDeleteModal = ref(false);
    const staffToDelete = ref(null);
    const deleting = ref(false);

    const loadStaff = async () => {
      try {
        loading.value = true;
        error.value = '';
        const data = await apiService.getStaffList();
        staffList.value = Array.isArray(data) ? data : (data.items || data.results || []);
      } catch (err) {
        console.error('Failed to load staff:', err);
        error.value = 'Failed to load staff members. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const confirmDelete = (staff) => {
      staffToDelete.value = staff;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      staffToDelete.value = null;
    };

    const deleteStaff = async () => {
      if (!staffToDelete.value) return;

      try {
        deleting.value = true;
        await apiService.deleteStaff(staffToDelete.value.id);
        await loadStaff();
        closeDeleteModal();
      } catch (err) {
        console.error('Failed to delete staff:', err);
        alert('Failed to delete staff member. Please try again.');
      } finally {
        deleting.value = false;
      }
    };

    onMounted(() => {
      loadStaff();
    });

    return {
      staffList,
      loading,
      error,
      showDeleteModal,
      staffToDelete,
      deleting,
      loadStaff,
      confirmDelete,
      closeDeleteModal,
      deleteStaff
    };
  }
};
</script>

<style scoped>
.staff-list {
  max-width: 1400px;
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

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.error-state,
.empty-state {
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

.staff-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table thead {
  background: #f8f9fa;
}

.staff-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.staff-table td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #666;
}

.staff-table tbody tr:hover {
  background: #f8f9fa;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  transition: transform 0.2s;
  background: transparent;
}

.action-btn:hover {
  transform: scale(1.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.modal-content p {
  margin: 0 0 25px 0;
  color: #666;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
