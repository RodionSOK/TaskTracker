import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = 'Bearer' + token;
    }
    return config;
})

api.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post('http://localhost:8000/api/v1/token/refresh/', { refresh: refreshToken });

            localStorage.setItem('accessToken', response.data.access);
            originalRequest.headers.Authorization = 'Bearer' + response.data.access;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location = '/login';
        };
    };
    return Promise.reject(error);
});

export const decodeJWT = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayLoad = decodeURIComponent(
            atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayLoad);
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
};

export const isTokenValid = (token) => {
    if (!token) return false;
    const decoded = decodeJWT(token);
    if (!decoded) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
}

export default api;
