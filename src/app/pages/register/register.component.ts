import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LoaderService } from '../../core/loader.service';
import { LoaderComponent } from '../../components/loader/loader.component';

export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    LoaderComponent,
    RouterLink,
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loaderService = inject(LoaderService);

  hidePassword = signal(true);

  hideConfirmPassword = signal(true);

  // Patron para el RFC
  public static readonly RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;

  // Patron para la Contraseña
  public static readonly PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;

  registerForm: FormGroup = this.fb.group({
    nombreEmpresa: ['', [Validators.required]],
    razonSocial: ['', [Validators.required]],
    rfc: ['', [Validators.required, Validators.pattern(RegisterComponent.RFC_PATTERN)]],
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.pattern(RegisterComponent.PASSWORD_PATTERN)]],
    confirmarContrasena: ['', [Validators.required, Validators.pattern(RegisterComponent.PASSWORD_PATTERN)]]
  }, {
    //
    validators: this.passwordMatchValidator
  });

  // Patron para el RFC
  get rfcControl() {
    return this.registerForm.get('rfc');
  }

  // Patron para la Contraseña
  get passwordControl() {
    return this.registerForm.get('contrasena');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmarContrasena');
  }

  // Validador para contraseñas
  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('contrasena')?.value;
    const confirm = g.get('confirmarContrasena')?.value;
    return pass === confirm ? null : {
      'mismatch' : true
    }
  }

  togglePassword() {
    this.hidePassword.update(prev => !prev);
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword.update(prev => !prev);
  }

  // Enviar informacion de registro
  onSubmit() {
    if(this.registerForm.valid) {
      this.loaderService.show();
      console.log('Datos de LogiPulse listos para enviar:', this.registerForm.value);
      // Simulacion de envio
      setTimeout(() => this.loaderService.hide(), 2000);
    } else {
      // Marcar todo como tocado para mostrar errores visuales
      this.registerForm.markAllAsTouched();
    }
  }
}
