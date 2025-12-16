import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/auth';

  constructor() { }

  login(credentials: { correoElectronico: string, contrasena: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token_logipulse');
  }

  logout() {
    // Borrar el token y datos del usuario
    sessionStorage.removeItem('token_logipulse');
    sessionStorage.removeItem('usuario_data');
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
