const API_BASE = (typeof window !== 'undefined' && window.__API_URL__)
  ? String(window.__API_URL__).replace(/\/$/, '')
  : '';

export const resolveEndpoint = (endpoint) => {
  if (!endpoint) return `${API_BASE}/api`;
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (clean.startsWith('/api/') || clean === '/api') {
    return `${API_BASE}${clean}`;
  }
  return `${API_BASE}/api${clean}`;
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

const serializeBody = (body) => {
  if (body === undefined) return undefined;
  if (typeof body === 'string') return body;
  return JSON.stringify(body);
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = resolveEndpoint(endpoint);
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        const msg = String(data.message || '').toLowerCase();
        if (msg.includes('expired') || msg.includes('invalid') || msg.includes('no longer exists')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      const message =
        data.message || `HTTP ${response.status} (${response.statusText}): Request to ${url} failed`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      error.url = url;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${url}]:`, error.message);
    throw error;
  }
};

export default {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    apiRequest(endpoint, { ...options, method: 'POST', body: serializeBody(body) }),
  put: (endpoint, body, options) =>
    apiRequest(endpoint, { ...options, method: 'PUT', body: serializeBody(body) }),
  patch: (endpoint, body, options) =>
    apiRequest(endpoint, { ...options, method: 'PATCH', body: serializeBody(body) }),
  delete: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

