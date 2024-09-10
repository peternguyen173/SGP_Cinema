import axios from 'axios';
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/auth',
})

export const signIn = async (username, password) => {
    try {
        const response = await instance.post('/admin/login', {username, password})
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

