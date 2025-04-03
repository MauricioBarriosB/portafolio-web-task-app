import axios from "axios";
import { AxiosError } from 'axios';
import qs from "qs";

const API_HASH_KEY = import.meta.env.VITE_APP_API_KEY_HASHED;
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const api = axios.create({ baseURL: API_BASE_URL, timeout: 9000 });

export const getTasks = async () => {
    try {
        const response = await api.get('tasks',
            { headers: { 'x-api-key': API_HASH_KEY } }
        )
        return response.data;
    } catch (error: any) {
        return(error.response.data.messages.error);
    }
};

export const createTask = async (userInputData: object) => {
    try {
        const response = await api.post('tasks/create',
            qs.stringify(userInputData), {
                headers: { 'x-api-key': API_HASH_KEY }
            }
        )
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        return axiosError.response?.data;
    }
};

export const deleteTask = async (id:number) => {
    try {
        const response = await api.delete(`tasks/delete/${id}`,
            { headers: { 'x-api-key': API_HASH_KEY } },
        )
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        return axiosError.response?.data;
    }
};

export const editTask = async (id:number) => {
    try {
        const response = await api.get(`tasks/edit/${id}`,
            { headers: { 'x-api-key': API_HASH_KEY } }
        )
        return response.data;
    } catch (error: any) {
        return(error.response.data.messages.error);
    }
};

export const updateTask = async (id:number  | unknown, userInputData: object) => {
    try {
        const response = await api.put(`tasks/update/${id}`,
            userInputData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_HASH_KEY 
                }
            }
        )
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        return axiosError.response?.data;
    }
};

export const patchTask = async (id:number  | unknown, userInputData: object) => {
    try {
        const response = await api.patch(`tasks/patch/${id}`,
            userInputData, {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'x-api-key': API_HASH_KEY 
                }
            }
        )
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        return axiosError.response?.data;
    }
};