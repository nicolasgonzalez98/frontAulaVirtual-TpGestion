import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEstablecimiento } from '../app/models/establecimiento.models';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {
  private apiUrl = environment.api_url_dev+'/establecimientos'; // Ajustá según tu backend

  constructor(private http: HttpClient) {}

  crearEstablecimiento(data: any): Observable<IEstablecimiento> {
    return this.http.post<IEstablecimiento>(this.apiUrl, data);
  }

  obtenerEstablecimientos(): Observable<IEstablecimiento[]> {
    return this.http.get<IEstablecimiento[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<IEstablecimiento> {
    return this.http.get<IEstablecimiento>(`${this.apiUrl}/${id}`);
  }

  actualizarEstablecimiento(id: string, data: any): Observable<IEstablecimiento> {
    return this.http.put<IEstablecimiento>(`${this.apiUrl}/${id}`, data);
  }

  eliminarEstablecimiento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
