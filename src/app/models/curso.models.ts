import { IEstablecimiento } from './establecimiento.models';

export interface ICurso {
  _id?: string;
  nombre: string;
  codigo?: string;
  anio?: number;
  descripcion?: string;
  establecimiento: string | IEstablecimiento;  // puede venir populado o solo con el ID
  docentes?: string[];                         // IDs de usuarios o usuarios populados más adelante
  modalidadClases: 'fechas_preestablecidas' | 'clases_diarias';
  fechaInicio?: string;                        // se maneja como string al recibir desde la API
  fechaFin?: string;
  duracionPorDiaHoras?: number;
  createdAt?: string;
  updatedAt?: string
}
