import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
    if (!this.usuario?._id) {
      console.log('❌ No hay usuario ID');
      return;
    }
    
    console.log('✅ Usuario ID:', this.usuario._id);
    this.loading = true;
    this.errorMessage = null;
    
    console.log('🔄 Llamando a obtenerCursosPorAlumno...');
    this.cursosService.obtenerCursosPorAlumno(this.usuario._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cursos) => {
          console.log('✅ Cursos recibidos:', cursos);
          this.cursos = cursos;
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error cargando mis cursos:', err);
          console.error('❌ Status:', err.status);
          console.error('❌ Message:', err.message);
          this.errorMessage = 'No se pudieron cargar tus cursos.';
          this.loading = false;
        }
      });
  }

  verCurso(cursoId: string): void {
    this.router.navigate(['/curso', cursoId]);
  }
}
