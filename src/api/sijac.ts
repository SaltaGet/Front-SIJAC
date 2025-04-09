import axios from 'axios';

// Usar la variable de entorno definida
const apiSijac = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export default apiSijac;
