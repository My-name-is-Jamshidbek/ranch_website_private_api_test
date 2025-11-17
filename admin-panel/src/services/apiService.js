import axios from 'axios';
import authService from './authService';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await authService.refreshAccessToken();
        
        // Retry the original request
        const token = authService.getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class ApiService {
  // Generic GET request
  async get(endpoint, params = {}) {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic POST request
  async post(endpoint, data = {}) {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic PUT request
  async put(endpoint, data = {}) {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic PATCH request
  async patch(endpoint, data = {}) {
    try {
      const response = await apiClient.patch(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic DELETE request
  async delete(endpoint) {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
  }

  // Staff-specific endpoints
  
  // Get all staff members
  getStaffList(params) {
    return this.get('/staff', params);
  }

  // Get single staff member
  getStaff(id) {
    return this.get(`/staff/${id}`);
  }

  // Create staff member
  createStaff(data) {
    return this.post('/staff', data);
  }

  // Update staff member
  updateStaff(id, data) {
    return this.put(`/staff/${id}`, data);
  }

  // Delete staff member
  deleteStaff(id) {
    return this.delete(`/staff/${id}`);
  }

  // Get current user profile
  getCurrentUser() {
    return this.get('/me');
  }
}

export default new ApiService();
