import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-list.component.html',
  styles: [`
    :host ::ng-deep .p-button.p-button-icon-only {
      width: 2.5rem;
      height: 2.5rem;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading = true;
      this.users = await this.userService.getUsers();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los usuarios'
      });
      // Datos de ejemplo si el backend no está disponible
      this.users = this.getMockUsers();
    } finally {
      this.loading = false;
    }
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  newUser() {
    this.router.navigate(['/admin/users/new']);
  }

  async toggleStatus(user: User) {
    this.confirmationService.confirm({
      message: `¿Desea ${user.activo ? 'desactivar' : 'activar'} a ${user.nombre} ${user.apellido}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {
        try {
          await this.userService.toggleUserStatus(user.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Estado actualizado correctamente'
          });
          await this.loadUsers();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el estado'
          });
        }
      }
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar a ${user.nombre} ${user.apellido}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await this.userService.deleteUser(user.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario eliminado correctamente'
          });
          await this.loadUsers();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el usuario'
          });
        }
      }
    });
  }

  getSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  getRoleSeverity(role: string): 'danger' | 'info' | 'success' | 'secondary' {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'PROFESOR': return 'info';
      case 'ESTUDIANTE': return 'success';
      default: return 'secondary';
    }
  }

  // Datos de ejemplo para desarrollo
  private getMockUsers(): User[] {
    return [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        dni: '12345678',
        rol: 'ESTUDIANTE',
        activo: true,
        telefono: '1234567890'
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@example.com',
        dni: '87654321',
        rol: 'PROFESOR',
        activo: true,
        telefono: '0987654321'
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos.lopez@example.com',
        dni: '11223344',
        rol: 'ADMIN',
        activo: true,
        telefono: '1122334455'
      },
      {
        id: 4,
        nombre: 'Ana',
        apellido: 'Martínez',
        email: 'ana.martinez@example.com',
        dni: '55667788',
        rol: 'ESTUDIANTE',
        activo: false,
        telefono: '5566778899'
      }
    ];
  }
}

