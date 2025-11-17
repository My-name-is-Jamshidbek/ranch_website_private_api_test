<template>
  <div class="staff-form">
    <div class="page-header">
      <h1>{{ isEditMode ? 'Edit Staff Member' : 'Add New Staff Member' }}</h1>
      <router-link to="/staff" class="btn btn-secondary">
        ← Back to List
      </router-link>
    </div>

    <div v-if="loading && isEditMode" class="loading-state">
      <div class="spinner"></div>
      <p>Loading staff data...</p>
    </div>

    <div v-else class="form-content">
      <form @submit.prevent="handleSubmit" class="staff-form-card">
        <div class="form-section">
          <h3>Basic Information</h3>
          
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter full name"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter email address"
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="Enter phone number"
            />
          </div>

          <div class="form-group">
            <label for="position">Position *</label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              required
              placeholder="Enter position"
            />
          </div>

          <div class="form-group">
            <label for="department">Department</label>
            <input
              id="department"
              v-model="form.department"
              type="text"
              placeholder="Enter department"
            />
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="form.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3>Additional Information</h3>
          
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea
              id="bio"
              v-model="form.bio"
              rows="4"
              placeholder="Enter bio or description"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              placeholder="Enter any additional notes"
            ></textarea>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update Staff' : 'Create Staff') }}
          </button>
          <button type="button" @click="handleCancel" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '../services/apiService';

export default {
  name: 'StaffFormView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const form = ref({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'active',
      bio: '',
      notes: ''
    });

    const loading = ref(false);
    const submitting = ref(false);
    const error = ref('');

    const isEditMode = computed(() => !!route.params.id);
    const staffId = computed(() => route.params.id);

    const loadStaff = async () => {
      if (!isEditMode.value) return;

      try {
        loading.value = true;
        error.value = '';
        const staff = await apiService.getStaff(staffId.value);
        
        // Populate form with staff data
        form.value = {
          name: staff.name || '',
          email: staff.email || '',
          phone: staff.phone || '',
          position: staff.position || '',
          department: staff.department || '',
          status: staff.status || 'active',
          bio: staff.bio || '',
          notes: staff.notes || ''
        };
      } catch (err) {
        console.error('Failed to load staff:', err);
        error.value = 'Failed to load staff data. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        submitting.value = true;
        error.value = '';

        if (isEditMode.value) {
          await apiService.updateStaff(staffId.value, form.value);
        } else {
          await apiService.createStaff(form.value);
        }

        // Redirect to staff list on success
        router.push({ name: 'StaffList' });
      } catch (err) {
        console.error('Failed to save staff:', err);
        error.value = `Failed to ${isEditMode.value ? 'update' : 'create'} staff member. Please try again.`;
      } finally {
        submitting.value = false;
      }
    };

    const handleCancel = () => {
      router.push({ name: 'StaffList' });
    };

    onMounted(() => {
      if (isEditMode.value) {
        loadStaff();
      }
    });

    return {
      form,
      loading,
      submitting,
      error,
      isEditMode,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>
.staff-form {
  max-width: 800px;
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

.btn-primary:hover:not(:disabled) {
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
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

.staff-form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section:last-of-type {
  margin-bottom: 20px;
}

.form-section h3 {
  color: #333;
  font-size: 20px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #fee;
  color: #c33;
  border-radius: 6px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  padding-top: 10px;
}
</style>
