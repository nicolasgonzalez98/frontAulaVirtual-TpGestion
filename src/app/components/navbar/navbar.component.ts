import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/authService';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Flags por rol
  isAdmin = false;
  isSuperAdmin = false;
  isDocente = false;
  isAlumno = false;

  // Estado visual de los submenús
  showMenus: Record<string, boolean> = {};

  // Definición de items del menú
  menuItems = [
    {
      label: 'Cursos',
      visible: () => this.isAlumno || this.isDocente,
      submenuKey: 'showCursosMenu',
      submenu: [
        { label: 'Mis cursos', path: '/cursos/mis-cursos', visible: () => this.isAlumno || this.isDocente },
        { label: 'Explorar cursos', path: '/cursos', visible: () => this.isAlumno },
        { label: 'Crear curso', path: '/cursos/crear', visible: () => this.isDocente }
      ]
    },
    {
      label: 'Usuarios',
      visible: () => this.isAdmin || this.isSuperAdmin,
      submenuKey: 'showUsuariosMenu',
      submenu: [
        { label: 'Gestionar usuarios', path: '/admin/usuarios', visible: () => this.isAdmin || this.isSuperAdmin },
        { label: 'Registrar docente', path: '/admin/crear-docente', visible: () => this.isAdmin || this.isSuperAdmin }
      ]
    },
    {
      label: 'Administración',
      visible: () => this.isSuperAdmin,
      submenuKey: 'showAdminMenu',
      submenu: [
        { label: 'Panel principal', path: '/superadmin', visible: () => this.isSuperAdmin },
        { label: 'Configurar sistema', path: '/superadmin/configuracion', visible: () => this.isSuperAdmin }
      ]
    }
  ];

  constructor(public authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.isAdmin = user?.rol === 'admin';
      this.isSuperAdmin = user?.rol === 'superadmin';
      this.isDocente = user?.rol === 'docente';
      this.isAlumno = user?.rol === 'alumno';
    });
  }
}

