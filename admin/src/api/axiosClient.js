import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json',
    }
    });

instance.interceptors.request.use((config) => {
    const token = Cookies.get('authToken'); // Get the latest token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Set Authorization header
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Request interceptor to add Authorization header
instance.interceptors.request.use((config) => {
    const token = Cookies.get('authToken'); // Get access token from cookies
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Set Authorization header
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Flag to avoid multiple refresh requests at once
let isRefreshing = false;
let refreshSubscribers = [];

// Function to subscribe to the refresh process
const onRefreshed = (accessToken) => {
    refreshSubscribers.map((callback) => callback(accessToken));
};

// Function to add subscribers
const addSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Response interceptor to handle token expiration
instance.interceptors.response.use(
    (response) => {
        return response; // If response is successful, return it
    },
    async (error) => {
        const { response, config } = error;

        if (response && response.status === 401) { // 401 Unauthorized error
            const originalRequest = config;

            if (!isRefreshing) {
                isRefreshing = true;
                const refreshToken = Cookies.get('refreshToken'); // Get refresh token

                if (refreshToken) {
                    try {
                        // Make API call to refresh the access token
                        const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
                        const newAccessToken = refreshResponse.data.token;

                        // Update access token in cookies
                        Cookies.set('authToken', newAccessToken);

                        // Update Authorization header in the original request and retry it
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                        // Notify all subscribers that the token has been refreshed
                        isRefreshing = false;
                        onRefreshed(newAccessToken);

                        return instance(originalRequest); // Retry the original request
                    } catch (refreshError) {
                        // If refreshing fails, log the user out
                        isRefreshing = false;
                        Cookies.remove('authToken');
                        Cookies.remove('refreshToken');
                        window.location.href = '/signin'; // Redirect to login
                        return Promise.reject(refreshError);
                    }
                } else {
                    // If there's no refresh token, log the user out
                    Cookies.remove('authToken');
                    window.location.href = '/signin'; // Redirect to login
                    return Promise.reject(error);
                }
            } else {
                // If the token is already being refreshed, queue the requests
                return new Promise((resolve) => {
                    addSubscriber((newAccessToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        resolve(instance(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error); // For other errors, reject as usual
    }
);

export default instance;