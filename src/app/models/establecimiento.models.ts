import { ICurso } from "./curso.models";

export interface IEstablecimiento {
  _id?: string;             // opcional, ya que puede no existir antes de guardar
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  latitud?: number;
  longitud?: number;
  responsable?: {
    nombre: string;
    email: string;
    password?: string; 
  };
  cursos?: (string | ICurso)[];        
  createdAt?: string;       
  updatedAt?: string;
}
