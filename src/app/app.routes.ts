import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { doadorGuard } from './core/guards/doador.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'animais',
    loadComponent: () => import('./modules/animals/animal-list/animal-list.component').then(m => m.AnimalListComponent)
  },
  {
    path: 'animais/cadastrar',
    loadComponent: () => import('./modules/animals/animal-form/animal-form.component').then(m => m.AnimalFormComponent),
    canActivate: [authGuard, doadorGuard]
  },
  {
    path: 'animais/:id',
    loadComponent: () => import('./modules/animals/animal-detail/animal-detail.component').then(m => m.AnimalDetailComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
