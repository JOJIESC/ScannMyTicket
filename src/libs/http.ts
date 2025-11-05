import axios from 'axios';

export const http = axios.create({
  baseURL: '/',            // rutas relativas (sirve en prod y dev)
  withCredentials: true,   // para que la cookie HttpOnly viaje
});
