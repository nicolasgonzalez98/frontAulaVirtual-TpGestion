// src/app/interfaces/usuario.interface.ts

export interface IUsuario {
  _id?: string;  // opcional, porque aún no existe al crear uno nuevo
  nombre: string;
  apellido: string;
  email: string;
  password?: string; // no siempre se envía desde el front
  rol: Rol;
  establecimientos?: string[]; // IDs referenciando establecimientos
  createdAt?: Date;
  updatedAt?: Date;
}

// Enum con los roles definidos en el backend
export enum Rol {
  Alumno = 'alumno',
  Docente = 'docente',
  Admin = 'admin',
  Superadmin = 'superadmin',
}
