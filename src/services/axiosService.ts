import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './authService' // Ajustá la ruta según tu proyecto

@Injectable({
  providedIn: 'root'
})
export class AxiosClientService {
  private axiosClient: AxiosInstance;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Crear instancia de Axios
    this.axiosClient = axios.create({
      baseURL: this.getBaseUrl(),
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Interceptor de requests: agrega el token si existe
    this.axiosClient.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor de respuestas: redirige si hay error 401
    this.axiosClient.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return Promise.reject(error);
      }
    );
  }

  /** Retorna la URL base según el entorno */
  private getBaseUrl(): string {
    switch (location.hostname) {
      default:
        return environment.api_url_dev; // Asegurate de definir esto en environment.ts
    }
  }

  /** Exponer instancia configurada */
  get client(): AxiosInstance {
    return this.axiosClient;
  }
}
