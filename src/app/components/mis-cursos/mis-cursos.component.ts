import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';
import { ClasesService } from '../../../services/clase.service';
import { AuthService } from '../../../services/authService';
import { ICurso } from '../../models/curso.models';
import { IUsuario } from '../../models/usuario.models';
import { IClase } from '../../models/clase.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CursoComponent } from '../curso/curso.component';

@Component({
  selector: 'app-mis-cursos',
  imports: [CommonModule,CursoComponent],
  templateUrl: './mis-cursos.component.html',
  styleUrl: './mis-cursos.component.css'
})
export class MisCursosComponent implements OnInit, OnDestroy {
  cursos: ICurso[] = [];
  usuario: IUsuario | null = null;
  loading = false;
  errorMessage: string | null = null;
  clasesMap: Map<string, IClase[]> = new Map();

  private destroy$ = new Subject<void>();

  constructor(
    private cursosService: CursosService,
    private clasesService: ClasesService,
    private authService: AuthService,
    private router: Router
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
    
    const observable = this.usuario.rol === 'docente' 
      ? this.cursosService.obtenerCursosPorDocente(this.usuario._id)
      : this.cursosService.obtenerCursosPorAlumno(this.usuario._id);
    
    observable
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cursos) => {
          this.cursos = cursos;
          if (this.esDocente) {
            this.loadClasesPorCursos();
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando mis cursos:', err);
          this.errorMessage = 'No se pudieron cargar tus cursos.';
          this.loading = false;
        }
      });
  }

    loadClasesPorCursos(): void {
    this.cursos.forEach(curso => {
      if (curso._id) {
        this.clasesService.obtenerClasesPorCurso(curso._id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (clases) => {
              this.clasesMap.set(curso._id!, clases);
            },
            error: (err) => console.error('Error cargando clases:', err)
          });
      }
    });
  }

  verCurso(cursoId: string): void {
    this.router.navigate(['/curso', cursoId]);
  }

  verQR(cursoId: string): void {
    const clases = this.clasesMap.get(cursoId);
    if (clases && clases.length > 0) {
      this.router.navigate(['/clases', cursoId, clases[0]._id, 'qr']);
    }
  }

  get esDocente(): boolean {
    return this.usuario?.rol === 'docente';
  }

  tieneClases(cursoId: string): boolean {
    const clases = this.clasesMap.get(cursoId);
    return clases ? clases.length > 0 : false;
  }
}
