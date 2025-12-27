import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegisterService } from '../../services/register.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LoaderService } from '../../core/loader.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { NotificacionService } from '../../core/services/notificacion.service';

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
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private notificationService = inject(NotificacionService);

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
    // Validador de contraseña
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
    if (this.registerForm.valid) {
      this.loaderService.show();
      const payload = this.registerForm.value;
        this.registerService.register(payload).subscribe({
          next: (response: any) => {
            console.log('Registro de Usuario Exitoso', response);
            this.loaderService.hide();
            this.notificationService.showSuccess('Registro exitoso. Inicia sesion para continuar.');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al registrar:', err);
            this.loaderService.hide();
            const msg = err?.error?.message || 'Error al procesar registro. Intenta nuevamente.';
            this.notificationService.shownError(msg)
          }
        });
    } else {
      // Marcar todo como tocado para mostrar errores visuales
      this.registerForm.markAllAsTouched();
    }
  }
}
