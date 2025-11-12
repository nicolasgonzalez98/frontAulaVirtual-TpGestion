// ...existing code...
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CursosService } from '../../../services/cursos.service';
import { ICurso } from '../../models/curso.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-cursos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cursos.component.html',
  styleUrl: './admin-cursos.component.css'
})
export class AdminCursosComponent implements OnInit, OnDestroy {
  cursos: ICurso[] = [];
  selectedCurso: ICurso | null = null;
  cursoForm: Partial<ICurso> = {}; // usar para crear/editar
  loading = false;
  errorMessage: string | null = null;
  showForm = false;
  isEditing = false;
  searchQuery = '';
  docentesInput = '';

  private destroy$ = new Subject<void>();

  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.loadCursos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    // UI Methods
  showCreateForm(): void {
    this.cursoForm = { modalidadClases: 'fechas_preestablecidas' };
    this.docentesInput = '';
    this.showForm = true;
    this.isEditing = false;
  }

  showEditForm(curso: ICurso): void {
    this.cursoForm = { ...curso };
    this.docentesInput = curso.docentes?.join(', ') || '';
    this.showForm = true;
    this.isEditing = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.cursoForm = {};
    this.docentesInput = '';
    this.errorMessage = null;
  }

  submitForm(): void {
    if (this.docentesInput.trim()) {
      this.cursoForm.docentes = this.docentesInput.split(',').map(d => d.trim()).filter(d => d);
    }
    
    if (this.isEditing && this.cursoForm._id) {
      this.actualizarCurso(this.cursoForm._id, this.cursoForm);
    } else {
      this.crearCurso();
    }
  }

  onSearch(): void {
    this.buscarCursos(this.searchQuery);
  }
  
  get cursosActivos(): number {
    return this.cursos.filter(c => c.fechaFin && new Date(c.fechaFin) > new Date()).length;
  }

  confirmDelete(curso: ICurso): void {
    if (confirm(`¿Estás seguro de eliminar el curso "${curso.nombre}"?`)) {
      this.eliminarCurso(this.getId(curso));
    }
  }

  // Cargar todos los cursos
  loadCursos(): void {
    this.loading = true;
    this.errorMessage = null;
    this.cursosService.obtenerCursos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cursos = data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando cursos', err);
          this.errorMessage = 'No se pudieron cargar los cursos.';
          this.loading = false;
        }
      });
  }

  // Crear un curso (usar cursoForm para enviar)
  crearCurso(): void {
    if (!this.cursoForm) return;
    this.loading = true;
    this.errorMessage = null;
    this.cursosService.crearCurso(this.cursoForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created) => {
          // agregar al listado y limpiar formulario
          this.cursos.unshift(created);
          this.cursoForm = {};
          this.loading = false;
        },
        error: (err) => {
          console.error('Error creando curso', err);
          this.errorMessage = 'No se pudo crear el curso.';
          this.loading = false;
        }
      });
  }

  // Obtener curso por id y setear selectedCurso
  obtenerCursoPorId(id: string): void {
    if (!id) return;
    this.loading = true;
    this.errorMessage = null;
    this.cursosService.obtenerCursoPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (curso) => {
          this.selectedCurso = curso;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error obteniendo curso', err);
          this.errorMessage = 'No se pudo obtener el curso.';
          this.loading = false;
        }
      });
  }

// Actualizar curso - primero busca por ID, luego aplica los datos para editar
actualizarCurso(id: string, datosEdicion: Partial<ICurso>): void {
  if (!id) {
    this.errorMessage = 'ID de curso requerido.';
    return;
  }

  this.loading = true;
  this.errorMessage = null;

  // Primero buscar el curso por ID
  this.cursosService.obtenerCursoPorId(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (cursoEncontrado) => {
        // Una vez encontrado, aplicar los datos de edición
        const payload: Partial<ICurso> = { ...datosEdicion };
        
        // Eliminar campos gestionados por el servidor
        delete (payload as any)._id;
        delete (payload as any).createdAt;
        delete (payload as any).updatedAt;

        // Proceder con la actualización
        this.cursosService.actualizarCurso(id, payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (updated) => {
              const updatedId = this.getId(updated);
              const idx = this.cursos.findIndex(c => this.getId(c) === updatedId);
              if (idx > -1) {
                this.cursos[idx] = updated;
              }
              this.selectedCurso = updated;
              this.loading = false;
            },
            error: (err) => {
              console.error('Error actualizando curso', err);
              this.errorMessage = 'No se pudo actualizar el curso.';
              this.loading = false;
            }
          });
      },
      error: (err) => {
        console.error('Error buscando curso para actualizar', err);
        this.errorMessage = 'No se encontró el curso a actualizar.';
        this.loading = false;
      }
    });
}


  // Eliminar curso
  eliminarCurso(id: string): void {
    if (!id) return;
    this.loading = true;
    this.errorMessage = null;
    this.cursosService.eliminarCurso(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cursos = this.cursos.filter(c => this.getId(c) !== id);
          if (this.selectedCurso && this.getId(this.selectedCurso) === id) this.selectedCurso = null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error eliminando curso', err);
          this.errorMessage = 'No se pudo eliminar el curso.';
          this.loading = false;
        }
      });
  }

  // Buscar cursos por query
  buscarCursos(q: string): void {
    if (!q || q.trim() === '') {
      this.loadCursos();
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.cursosService.buscarCursos(q)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.cursos = result || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error buscando cursos', err);
          this.errorMessage = 'Error en la búsqueda de cursos.';
          this.loading = false;
        }
      });
  }

  // Obtener cursos por establecimiento
  obtenerPorEstablecimiento(establecimientoId: string): void {
    if (!establecimientoId) return;
    this.loading = true;
    this.errorMessage = null;
    this.cursosService.obtenerCursosPorEstablecimiento(establecimientoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cursos = data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error obteniendo cursos por establecimiento', err);
          this.errorMessage = 'No se pudieron obtener los cursos del establecimiento.';
          this.loading = false;
        }
      });
  }

  // Util: normalizar id (puede ser _id o id según backend)
  private getId(curso: Partial<ICurso>): string {
    // @ts-ignore
    return (curso && (curso._id || (curso as any).id)) || '';
  }
}