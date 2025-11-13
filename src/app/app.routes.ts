import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GuestGuard } from './guards/guest.guard';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RegistroEstablecimientoComponent } from './components/registro-establecimiento/registro-establecimiento.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { HomeComponent } from './components/home-component/home-component.component';
import { AsistenciaRegistroComponent } from './components/asistencia-registro/asistencia-registro.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
            { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
            { path: 'registro-establecimiento', component: RegistroEstablecimientoComponent, canActivate: [GuestGuard] },
            { path: 'por-que-elegirnos', component: BeneficiosComponent, canActivate: [GuestGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { 
              path: '', 
              redirectTo: '/home', 
              pathMatch: 'full' 
            },
            {
              path: 'admin/usuarios',
              loadComponent: () => import('./components/admin/user-list/user-list.component')
                .then(m => m.UserListComponent),
              canActivate: [AuthGuard, RoleGuard],
              data: { roles: ['admin'] }
            },
            {
              path: 'admin/usuarios/nuevo',
              loadComponent: () => import('./components/admin/user-form/user-form.component')
                .then(m => m.UserFormComponent),
              canActivate: [AuthGuard, RoleGuard],
              data: { roles: ['admin'] }
            },
            {
              path: 'admin/usuarios/editar/:id',
              loadComponent: () => import('./components/admin/user-form/user-form.component')
                .then(m => m.UserFormComponent),
              canActivate: [AuthGuard, RoleGuard],
              data: { roles: ['admin'] }
            },
            {
              path: 'admin/cursos',
              loadComponent: () => import('./components/admin-cursos/admin-cursos.component')
                .then(m => m.AdminCursosComponent),
              canActivate: [AuthGuard, RoleGuard],
              data: { roles: ['admin'] }
            },
            {
              path: 'mis-cursos',
              loadComponent: () => import('./components/mis-cursos/mis-cursos.component')
                .then(m => m.MisCursosComponent),
              canActivate: [AuthGuard]
            },
            {
              path: 'clases/:cursoId/:idClase/qr',
              loadComponent: () => import('./pages/asistencia-qr/asistencia-qr.component')
                .then(m => m.AsistenciaQrComponent),
               // opcional: agregar RoleGuard
            },
            { 
              path: 'asistencia/:cursoId/:claseId',
              loadComponent: () => import('./components/asistencia-registro/asistencia-registro.component')
                .then(m => m.AsistenciaRegistroComponent)
            },
            {
              path: '**',
              redirectTo: '/home'
            }
        ]
    }
];
