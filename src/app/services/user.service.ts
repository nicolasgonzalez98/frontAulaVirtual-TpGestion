import { Injectable } from '@angular/core';
import axios from 'axios';
import { User, UserForm } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get<User[]>(this.apiUrl);
      return response.data.map(user => this.normalizeUser(user));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get<User>(`${this.apiUrl}/${id}`);
      return this.normalizeUser(response.data);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  async createUser(user: UserForm): Promise<User> {
    try {
      const payload = this.buildPayload(user);
      const response = await axios.post<User>(`${this.apiUrl}/register`, payload);
      return this.normalizeUser(response.data);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async updateUser(id: string, user: UserForm): Promise<User> {
    try {
      const payload = this.buildPayload(user);
      const response = await axios.put<User>(`${this.apiUrl}/${id}`, payload);
      return this.normalizeUser(response.data);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  async deleteUser(id: string ): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: string): Promise<User> {
    const response = await axios.patch<User>(`${this.apiUrl}/${id}/toggle-status`);
    return response.data; // 👈 tu backend retorna {message, user}
  }

  async changeUserRole(id: string, role: string): Promise<User> {
    try {
      const response = await axios.patch<User>(`${this.apiUrl}/${id}/role`, { role });
      return this.normalizeUser(response.data);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      throw error;
    }
  }

  private normalizeUser(user: any): User {
    return {
      _id: user._id ?? user.id ?? '',
      nombre: user.nombre ?? '',
      apellido: user.apellido ?? '',
      email: user.email ?? '',
      dni: user.dni,
      rol: (user.rol ?? '').toString(),
      activo: user.activo ?? true,
      telefono: user.telefono,
      establecimientos: user.establecimientos,
      establecimientoAdministra: user.establecimientoAdministra ?? null,
      fechaCreacion: user.fechaCreacion,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  private buildPayload(user: UserForm) {
    const payload: any = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      password: user.password,
      rol: user.rol?.toLowerCase?.() ?? user.rol
    };

    return payload;
  }
}

