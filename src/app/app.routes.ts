import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // Componente Login
import { RegisterComponent } from './pages/register/register.component'; // Componete Register
import { MainLayoutComponent } from './layout/main-layout/main-layout.component'; // Mainlayout
import { authGuard } from './services/auth.guard'; // Guardia de autenticación
import { animation } from '@angular/animations';

export const routes: Routes = [
  // 1. Ruta Pública (Login)
  {
    path: 'login',
    component: LoginComponent,
    title: 'LogiPulse | Iniciar Sesión',
    data: { animation: 'LoginPage' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'LogiPulse | Registrate',
    data: { animation: 'RegisterPage' }
  },

  // 2. Rutas Privadas (Con Layout de Menu y Toolbar)
  {
    path: '',
    component: MainLayoutComponent, // Este componente tiene el <router-outlet> interno
    canActivate: [authGuard], // Protegemos todo el bloque
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'LogiPulse | Dashboard'
      },
      {
        path: 'empresa',
        loadComponent: () => import('./pages/empresa/empresa.component').then(m => m.EmpresaComponent),
        title: 'LogiPulse | Empresa'
      },
      {
        path: 'servicios',
        loadComponent: () => import('./pages/servicios/servicios.component').then(m => m.ServiciosComponent),
        title: 'LogiPulse | Servicios'
      },
      {
        path: 'facturas',
        loadComponent: () => import('./pages/facturas/facturas.component').then(m => m.FacturasComponent),
        title: 'LogiPulse | Facturas'
      },
      // Redirección por defecto si entran a la raíz y están logueados
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirección si la ruta no existe
  { path: '**', redirectTo: 'login' }
];
