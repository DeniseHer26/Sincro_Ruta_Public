import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmpresaService } from '../../core/services/empresa.service';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLinkActive, RouterLink],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css'
})
export class CustomSidenavComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private authService = inject(AuthService);
  private readonly UPLOADS_URL = 'http://localhost:3000/uploads/';

  empresaData = signal<any>(null);

  sideNavCollapsed = signal(false);

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100')

  // Se actualiza automáticamente cuando empresaData() cambia
  logoUrl = computed(() => {
    const logo = this.empresaData()?.logo;

    if (!logo || logo === 'default-logipulse.png') {
      return `${this.UPLOADS_URL}/default-logipulse.png`;
    }

    // Si por alguna razón el string ya trae la URL completa, no la duplicamos
    return logo.startsWith('http') ? logo : `${this.UPLOADS_URL}/${logo}`;
  });

  ngOnInit(){
    this.obtenerPerfil();
  }

  obtenerPerfil() {
    this.empresaService.getPerfil().subscribe({
      next: (data) => this.empresaData.set(data),
      error: (err) => console.error('Error al obtener perfil en Sidenav', err)
    });
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'dashboard',
      label: 'Empresa',
      route: 'empresa'
    },
    {
      icon: 'dashboard',
      label: 'Servicios',
      route: 'servicios'
    },{
      icon: 'dashboard',
      label: 'Facturas',
      route: 'facturas'
    }
  ]);

  logOut() {
    this.authService.logout();
  }
}
