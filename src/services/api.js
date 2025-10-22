import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
};

// Post services
export const postService = {
  getAllPosts: (page = 1, limit = 10, category, sortBy = 'createdAt', order = 'desc') => 
    api.get('/posts', { params: { page, limit, category, sortBy, order } }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  upvotePost: (id) => api.post(`/posts/${id}/upvote`)
};

// Comment services
export const commentService = {
  createComment: (commentData) => api.post('/comments', commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  upvoteComment: (id) => api.post(`/comments/${id}/upvote`),
};

// Debate services
export const debateService = {
  getAllDebates: (page = 1, limit = 10, category, sortBy = 'createdAt', order = 'desc') => 
    api.get('/debates', { params: { page, limit, category, sortBy, order } }),
  getDebateById: (id) => api.get(`/debates/${id}`),
  createDebate: (debateData) => api.post('/debates', debateData),
  updateDebate: (id, debateData) => api.put(`/debates/${id}`, debateData),
  deleteDebate: (id) => api.delete(`/debates/${id}`),
  addReply: (debateId, replyData) => api.post(`/debates/${debateId}/replies`, replyData),
  upvoteDebate: (id) => api.post(`/debates/${id}/upvote`)
};

export default api;