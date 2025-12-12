const API_URL = 'http://localhost:8081';

export const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('cinema_user');
      window.location.href = '#/login';
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  post: async (endpoint: string, body: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('cinema_user');
      window.location.href = '#/login';
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${errorText}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  delete: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('cinema_user');
      window.location.href = '#/login';
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${errorText}`);
    }
    
    return true;
  }
};
