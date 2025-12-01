import axios from "axios";

// Base URL of your backend
// Make sure your .env has: REACT_APP_API_URL=https://sabhaverse-main.onrender.com
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Do NOT include /api here
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Auth Service
// -----------------------------
export const authService = {
  register: async (userData) => {
    const response = await API.post("/api/auth/register", userData);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  },

  login: async (credentials) => {
    const response = await API.post("/api/auth/login", credentials);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  },

  getCurrentUser: () => API.get("/api/auth/me"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => !!localStorage.getItem("token"),
};

// -----------------------------
// Post Service
// -----------------------------
export const postService = {
  getAllPosts: (page = 1, limit = 10, category, sortBy = "createdAt", order = "desc") =>
    API.get("/api/posts", { params: { page, limit, category, sortBy, order } }),
  
  getPostById: (id) => API.get(`/api/posts/${id}`),
  createPost: (postData) => API.post("/api/posts", postData),
  updatePost: (id, postData) => API.put(`/api/posts/${id}`, postData),
  deletePost: (id) => API.delete(`/api/posts/${id}`),
  upvotePost: (id) => API.post(`/api/posts/${id}/upvote`),
};

// -----------------------------
// Comment Service
// -----------------------------
export const commentService = {
  createComment: (commentData) => API.post("/api/comments", commentData),
  updateComment: (id, commentData) => API.put(`/api/comments/${id}`, commentData),
  deleteComment: (id) => API.delete(`/api/comments/${id}`),
  upvoteComment: (id) => API.post(`/api/comments/${id}/upvote`),
};

// -----------------------------
// Debate Service
// -----------------------------
export const debateService = {
  getAllDebates: (page = 1, limit = 10, category, sortBy = "createdAt", order = "desc") =>
    API.get("/api/debates", { params: { page, limit, category, sortBy, order } }),
  
  getDebateById: (id) => API.get(`/api/debates/${id}`),
  createDebate: (debateData) => API.post("/api/debates", debateData),
  updateDebate: (id, debateData) => API.put(`/api/debates/${id}`, debateData),
  deleteDebate: (id) => API.delete(`/api/debates/${id}`),
  addReply: (debateId, replyData) => API.post(`/api/debates/${debateId}/replies`, replyData),
  upvoteDebate: (id) => API.post(`/api/debates/${id}/upvote`),
};

export default API;
