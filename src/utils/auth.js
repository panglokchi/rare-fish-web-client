import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        //console.log("Response received")
        //console.log(response.data.token)
        const access = response.data.token;
        localStorage.setItem("accessToken", access);
        //console.log("Set token in localStorage")
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, username, password });
        //console.log("Response received")
        //console.log(response.data.token)
        //const access = response.data.token;
        //localStorage.setItem("accessToken", access);
        //console.log("Set token in localStorage")
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const logout = async (email, password) => {
    try {
        localStorage.removeItem("accessToken");
    } catch (error) {
        throw error;
    }
};