import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'LogiPulse | Iniciar Sesion'
  },
    {
    path: 'dashboard',
    loadComponent: () => import('../app/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'empresa',
    loadComponent: () => import('../app/pages/empresa/empresa.component').then(m => m.EmpresaComponent)
  },
  {
    path: 'servicios',
    loadComponent: () => import('../app/pages/servicios/servicios.component').then(m => m.ServiciosComponent)
  },
  {
    path: 'facturas',
    loadComponent: () => import('../app/pages/facturas/facturas.component').then(m => m.FacturasComponent)

  }
];
