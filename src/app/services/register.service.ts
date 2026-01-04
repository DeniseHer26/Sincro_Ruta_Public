import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/empresas';

  constructor() { }

  // Registrar nueva empresa.
  register(credentials: {
    nombreEmpresa: string,
    razonSocial: string,
    rfc: string,
    correoElectronico: string,
    contrasena: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials).pipe(
      delay(1000)
    );
  }
}
