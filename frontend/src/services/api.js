import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified API Endpoint Handlers
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

export const hospitalAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    });
    return API.get(`/hospitals?${params.toString()}`);
  },
  getById: (id) => API.get(`/hospitals/${id}`),
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return API.get(`/hospitals/recommend?${query}`);
  },
  update: (id, data) => API.put(`/hospitals/${id}`, data)
};

export const doctorAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    });
    return API.get(`/doctors?${params.toString()}`);
  },
  getById: (id) => API.get(`/doctors/${id}`),
  create: (data) => API.post('/doctors', data),
  update: (id, data) => API.put(`/doctors/${id}`, data),
  delete: (id) => API.delete(`/doctors/${id}`)
};

export const appointmentAPI = {
  book: (data) => API.post('/appointments', data),
  getPatientAppointments: () => API.get('/appointments/patient'),
  getDoctorAppointments: () => API.get('/appointments/doctor'),
  getHospitalAppointments: () => API.get('/appointments/hospital'),
  updateStatus: (id, statusData) => API.put(`/appointments/${id}`, statusData)
};

export const healthRecordAPI = {
  upload: (data) => API.post('/health-records', data),
  getMyRecords: () => API.get('/health-records'),
  getPatientRecords: (patientId) => API.get(`/health-records/patient/${patientId}`)
};

export const prescriptionAPI = {
  create: (data) => API.post('/prescriptions', data),
  getByAppointment: (appointmentId) => API.get(`/prescriptions/appointment/${appointmentId}`),
  getMyPrescriptions: () => API.get('/prescriptions/patient')
};

export default API;
