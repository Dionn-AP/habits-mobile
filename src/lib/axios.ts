import axios from "axios";

export const api = axios.create({
    baseURL: 'https://my-habits.onrender.com'
})