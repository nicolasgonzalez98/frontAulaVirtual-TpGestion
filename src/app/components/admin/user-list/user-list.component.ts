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
    } finally {
      this.loading = false;
    }
  }

  newUser() {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(id: string) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  async toggleStatus(user: User) {
    this.confirmationService.confirm({
      message: `¿Desea ${user.active ? 'desactivar' : 'activar'} a ${user.nombre} ${user.apellido}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.userService.toggleUserStatus(user._id);
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
      accept: async () => {
        try {
          await this.userService.deleteUser(user._id);
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

  getSeverity(active: boolean) {
    return active ? 'success' : 'danger';
  }

  getRoleSeverity(role: string) {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'docente':
        return 'info';
      case 'alumno':
        return 'success';
      default:
        return 'secondary';
    }
  }
}
