export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN';
  activo: boolean;
  fechaCreacion?: Date;
  telefono?: string;
}

export interface UserForm {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol: string;
  activo: boolean;
  telefono?: string;
  password?: string;
  confirmPassword?: string;
}

