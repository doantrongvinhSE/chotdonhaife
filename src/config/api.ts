// API Configuration
const API_BASE_URL = import.meta.env.DEV
  ? '/api'  // Sử dụng proxy trong development
  : 'https://shbtrungphat.io.vn';  // Sử dụng trực tiếp trong production

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/posts`,
  COMMENTS: `${API_BASE_URL}/comments`,
  ORDERS: `${API_BASE_URL}/orders`,
} as const;

export default API_BASE_URL;
