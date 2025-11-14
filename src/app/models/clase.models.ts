export interface IClase {
  _id?: string;
  curso: string;
  docentes?: string[];
  fecha: string;
  tipo: 'presencial' | 'virtual';
  qr_code?: string;
  qr_type?: 'static' | 'dynamic';
  qr_expires_at?: string;
  createdAt?: string;
  updatedAt?: string;
}