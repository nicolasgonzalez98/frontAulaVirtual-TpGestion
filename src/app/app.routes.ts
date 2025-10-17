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

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
            { path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
            { path: 'registro-establecimiento',component: RegistroEstablecimientoComponent, canActivate: [GuestGuard]},
            { path: 'por-que-elegirnos', component:BeneficiosComponent, canActivate:[GuestGuard] },
        ]
    }
];
