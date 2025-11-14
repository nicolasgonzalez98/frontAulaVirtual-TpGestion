import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/authService';
import { CursosService } from '../../../services/cursos.service';
import { ICurso } from '../../models/curso.models';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {
  constructor(private cursoService: CursosService) { }

  ngOnInit(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: (cursos: ICurso[]) => {
        console.log('Cursos obtenidos del backend:', cursos);
      },
      error: (err) => {
        console.error('Error al obtener cursos:', err);
      }
    });
  }
  private authService = inject(AuthService);

  public userSignal = toSignal(this.authService.user$);

}