export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol: Rol;
  active: boolean;
  fechaCreacion?: Date;
  telefono?: string;
}

export interface UserForm {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol: string;
  active: boolean;
  telefono?: string;
}

export enum Rol {
  Alumno = 'alumno',
  Docente = 'docente',
  Admin = 'admin',
  Superadmin = 'superadmin',
}
