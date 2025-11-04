import { Injectable, Injector } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AxiosAuthService {
  private axiosAuth: AxiosInstance;

  constructor( private injector: Injector) {
    // Crear instancia base
    this.axiosAuth = axios.create({
      baseURL: this.getBaseUrl(),
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Interceptor de requests: agrega el token si existe
    this.axiosAuth.interceptors.request.use(config => {
      const token = localStorage.getItem('token'); // 👈 sin inyectar AuthService
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosAuth.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          const token = localStorage.getItem('token');
          console.log(token)
          console.warn('⚠️ Token inválido o no proporcionado:', error.response.data);
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          // window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /** Detecta el entorno actual y devuelve la URL del backend de auth */
  private getBaseUrl(): string {
    switch (location.hostname) {
      default:
        return environment.api_url_dev;
    }
  }

  /** Exponer instancia configurada */
  get client(): AxiosInstance {
    return this.axiosAuth;
  }
}
