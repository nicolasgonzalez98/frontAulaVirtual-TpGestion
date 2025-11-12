import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosService } from '../../../services/cursos.service';
import { AuthService } from '../../../services/authService';
import { ICurso } from '../../models/curso.models';
import { IUsuario } from '../../models/usuario.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mis-cursos',
  imports: [CommonModule],
  templateUrl: './mis-cursos.component.html',
  styleUrl: './mis-cursos.component.css'
})
export class MisCursosComponent implements OnInit, OnDestroy {
  cursos: ICurso[] = [];
  usuario: IUsuario | null = null;
  loading = false;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private cursosService: CursosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
    if (this.usuario?._id) {
      this.loadMisCursos();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMisCursos(): void {
    if (!this.usuario?._id) return;
    
    this.loading = true;
    this.errorMessage = null;
    
    this.cursosService.obtenerCursosPorAlumno(this.usuario._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cursos) => {
          this.cursos = this.filtrarCursosVigentes(cursos);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando mis cursos', err);
          this.errorMessage = 'No se pudieron cargar tus cursos.';
          this.loading = false;
        }
      });
  }

  private filtrarCursosVigentes(cursos: ICurso[]): ICurso[] {
    const hoy = new Date();
    return cursos.filter(curso => {
      if (!curso.fechaFin) return true;
      return new Date(curso.fechaFin) >= hoy;
    });
  }

  get cursosActivos(): ICurso[] {
    return this.cursos.filter(curso => {
      if (!curso.fechaInicio || !curso.fechaFin) return false;
      const hoy = new Date();
      return new Date(curso.fechaInicio) <= hoy && new Date(curso.fechaFin) >= hoy;
    });
  }

  get cursosProximos(): ICurso[] {
    return this.cursos.filter(curso => {
      if (!curso.fechaInicio) return false;
      return new Date(curso.fechaInicio) > new Date();
    });
  }
}
