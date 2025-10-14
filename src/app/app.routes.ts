import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/admin/users', 
    pathMatch: 'full' 
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./components/admin/user-list/user-list.component')
      .then(m => m.UserListComponent)
  },
  {
    path: 'admin/users/new',
    loadComponent: () => import('./components/admin/user-form/user-form.component')
      .then(m => m.UserFormComponent)
  },
  {
    path: 'admin/users/edit/:id',
    loadComponent: () => import('./components/admin/user-form/user-form.component')
      .then(m => m.UserFormComponent)
  },
  {
    path: '**',
    redirectTo: '/admin/users'
  }
];
