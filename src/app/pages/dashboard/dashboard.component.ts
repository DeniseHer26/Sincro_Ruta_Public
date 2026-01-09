import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmpresaService } from '../empresa/empresa.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private empresaService = inject(EmpresaService);

  // Signal para la información de la empresa
  empresaData = signal<any>(null);
  saludo = signal<string>('');

  ngOnInit() {
    this.obtenerPerfil();
    this.setSaludo();
  }

  obtenerPerfil() {
    this.empresaService.getPerfil().subscribe({
      next: (data) => this.empresaData.set(data),
      error: (err) => console.error('Error al obtener perfil', err)
    });
  }

  setSaludo() {
    const hora = new Date().getHours();
    if (hora < 12) this.saludo.set('Buenos Días');
    else if (hora < 19) this.saludo.set('Buenas Tardes');
    else this.saludo.set('Buenas Noches');
  }
}
