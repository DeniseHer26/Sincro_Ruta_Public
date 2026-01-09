import { Component, inject, OnInit, signal } from '@angular/core';
import { EmpresaService } from './empresa.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, RouterLink],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit{
  private empresaService = inject(EmpresaService);

  private router = inject(Router);
  private fb = inject(FormBuilder);

  loaderService = inject(LoaderService);

  perfilForm!: FormGroup;
  empresaData = signal<any>(null);

  ngOnInit() {
    this.initForm();
    this.cargarDatos();
  }

  initForm(){
    this.perfilForm = this.fb.group({
      nombreEmpresa: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      correoElectronico: [{ value: '', disabled: true }],
      numeroTelefonico: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      representanteLegal: [{ value: '', disabled: true }],
      giroEmpresarial: [{ value: '', disabled: true }]
    });
  }

  cargarDatos(){
    this.loaderService.show();
    this.empresaService.getPerfil().subscribe({
      next: (data) => {
        this.empresaData.set(data);
        this.perfilForm.patchValue(data);
        this.loaderService.hide();
      },
      error: () => this.loaderService.hide()
    });
  }
}
