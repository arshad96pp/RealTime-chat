import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://localhost:8000/api/auth",
});


export const getAllUsers = () => baseUrl.get();

export const signupData=(formData)=> baseUrl.post(`/register`,formData)

export const loginData=(formData)=> baseUrl.post('/login',formData)

