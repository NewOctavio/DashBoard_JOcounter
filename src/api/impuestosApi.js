import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL } = getEnvVariables();

const impuestosApi = axios.create({
    baseURL: VITE_API_URL,
});

//Configuración de interceptores
impuestosApi.interceptors.request.use((config) => {

    config.headers = {
        ...config.headers, // Mantener los headers que ya tenga
        'x-token': localStorage.getItem('token') // Agregar el token al header
    }

    return config;
});

export default impuestosApi;