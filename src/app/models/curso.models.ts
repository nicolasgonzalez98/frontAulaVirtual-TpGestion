import { IEstablecimiento } from './establecimiento.models';

export interface ICurso {
  _id?: string;
  nombre: string;
  codigo?: string;
  anio?: number;
  descripcion?: string;
  establecimiento: string | IEstablecimiento;
  docentes?: string[];
  alumno?: string[]; // IDs de alumnos
  modalidadClases: 'fechas_preestablecidas' | 'clases_diarias';
  duracionPorDiaHoras?: number;
  createdAt?: string;
  updatedAt?: string;
}
