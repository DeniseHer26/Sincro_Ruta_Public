import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/empresas'; // Ajusta según tu main.ts

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil`);
  }
}
