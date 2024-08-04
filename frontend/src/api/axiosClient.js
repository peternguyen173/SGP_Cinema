import axios from 'axios';
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Ensure this is correct
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // Or wherever you're storing the token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosClient;
