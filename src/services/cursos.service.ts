import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICurso } from '../app/models/curso.models';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private apiUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) { }

  crearCurso(data: Partial<ICurso>): Observable<ICurso> {
    return this.http.post<ICurso>(this.apiUrl, data);
  }

  obtenerCursos(): Observable<ICurso[]> {
    return this.http.get<ICurso[]>(this.apiUrl);
  }

  obtenerCursoPorId(id: string): Observable<ICurso> {
    return this.http.get<ICurso>(`${this.apiUrl}/${id}`);
  }

  actualizarCurso(id: string, data: Partial<ICurso>): Observable<ICurso> {
    return this.http.put<ICurso>(`${this.apiUrl}/${id}`, data);
  }

  eliminarCurso(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerCursosPorEstablecimiento(establecimientoId: string): Observable<ICurso[]> {
    return this.http.get<ICurso[]>(`${this.apiUrl}/establecimiento/${establecimientoId}`);
  }

  obtenerCursosPorAlumno(alumnoId: string): Observable<ICurso[]> {
    return this.http.get<ICurso[]>(`${this.apiUrl}/alumno/${alumnoId}`);
  }

  buscarCursos(q: string): Observable<ICurso[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<ICurso[]>(`${this.apiUrl}/buscar`, { params });
  }

  vincularAlumno(cursoId: string, alumnoId: string): Observable<ICurso> {
    return this.http.post<ICurso>(`${this.apiUrl}/${cursoId}/alumnos/${alumnoId}`, {});
  }

  desvincularAlumno(cursoId: string, alumnoId: string): Observable<ICurso> {
    return this.http.delete<ICurso>(`${this.apiUrl}/${cursoId}/alumnos/${alumnoId}`);
  }
}