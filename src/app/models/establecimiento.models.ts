import { ICurso } from "./curso.models";

export interface IEstablecimiento {
  _id?: string;             // opcional, ya que puede no existir antes de guardar
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  latitud?: number;
  longitud?: number;
  cursos?: (string | ICurso)[];        // IDs de cursos referenciados (ObjectId en backend)
  createdAt?: string;       // timestamps automáticos de Mongoose
  updatedAt?: string;
}
