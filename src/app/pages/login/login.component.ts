import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder, } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if(this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('LOGIN EXITOSO', response);

          sessionStorage.setItem('token_logipulse', response.token);

          sessionStorage.setItem('usuario_data', JSON.stringify(response.empresa));

          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          console.error('Error de Login', err);
          alert('Credenciales incorrectas o error en el servidor')
        }
      })
    }
  }
}
