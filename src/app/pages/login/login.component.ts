import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder, } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { LoaderService } from '../../core/loader.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    LoaderComponent,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificacionService);

  loaderService = inject(LoaderService);

  hidePassword = signal(true);

  loginForm: FormGroup = this.fb.group({
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  togglePassword() {
    this.hidePassword.update(prev => !prev);
  }

  // Envia la informacion de inicio de sesion
  onSubmit() {
    if(this.loginForm.valid) {
      this.loaderService.show();
      const payload = this.loginForm.value;
      this.authService.login(payload).subscribe({
        next: (response: any) => {
          console.log('Login de Usuario Exitoso', response);
          this.loaderService.hide();
          sessionStorage.setItem('token_logipulse', response.token);
          sessionStorage.setItem('usuario_data', JSON.stringify(response.empresa));
          this.notificationService.showSuccess('Inicio de sesion exitoso.');
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          console.error('Error de Login', err);
          this.loaderService.hide();
          const msg = err?.error?.message || 'Error al iniciar sesion. Intente nuevamente.';
          this.notificationService.shownError(msg);
        }
      })
    } else {
      // Marcar todo como tocado para mostrar errores visuales
      this.loginForm.markAllAsTouched();
    }
  }
}
