import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClase } from '../app/models/clase.models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiUrl = environment.api_url_dev+'/clases';

  constructor(private http: HttpClient) { }

  crearClase(data: Partial<IClase>): Observable<IClase> {
    return this.http.post<IClase>(this.apiUrl, data);
  }

  obtenerClases(): Observable<IClase[]> {
    return this.http.get<IClase[]>(this.apiUrl);
  }

  obtenerClasePorId(id: string): Observable<IClase> {
    return this.http.get<IClase>(`${this.apiUrl}/${id}`);
  }

  obtenerClasesPorCurso(cursoId: string): Observable<IClase[]> {
    return this.http.get<IClase[]>(`${this.apiUrl}/curso/${cursoId}`);
  }

  obtenerClasesPorRangoFechas(desde: string, hasta: string): Observable<IClase[]> {
    return this.http.get<IClase[]>(`${this.apiUrl}/rango-fechas?desde=${desde}&hasta=${hasta}`);
  }

  actualizarClase(id: string, data: Partial<IClase>): Observable<IClase> {
    return this.http.put<IClase>(`${this.apiUrl}/${id}`, data);
  }

  eliminarClase(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}