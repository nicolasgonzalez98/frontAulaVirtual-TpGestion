export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni?: string;
  rol: string;
  activo?: boolean;
  fechaCreacion?: Date;
  telefono?: string;
  establecimientos?: string[];
  establecimientoAdministra?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserForm {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  password?: string;
  confirmPassword?: string;
}

