const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || '请求失败');
  }

  return data;
}

const api = {
  auth: {
    register: (username, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),

    login: (username, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),

    me: () => request('/auth/me')
  },

  todos: {
    getAll: (filter = 'all') => request(`/todos?filter=${filter}`),

    create: (text, category) =>
      request('/todos', {
        method: 'POST',
        body: JSON.stringify({ text, category })
      }),

    update: (id, data) =>
      request(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    delete: (id) =>
      request(`/todos/${id}`, { method: 'DELETE' })
  }
};
