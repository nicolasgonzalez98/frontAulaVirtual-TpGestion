import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { IUsuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user: IUsuario | null = this.authService.getUser();
    const allowedRoles = route.data['roles'] as string[];

    // Si no está logueado → redirigir a login
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Si no tiene rol permitido → redirigir a inicio
    if (!allowedRoles.includes(user.rol)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
