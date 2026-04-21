const auth = {
  getToken: () => localStorage.getItem('token'),
  getUsername: () => localStorage.getItem('username'),

  saveAuth: (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  isLoggedIn: () => !!localStorage.getItem('token'),

  requireAuth: () => {
    if (!auth.isLoggedIn()) {
      window.location.href = '/login.html';
    }
  },

  logout: () => {
    auth.clearAuth();
    window.location.href = '/login.html';
  }
};
