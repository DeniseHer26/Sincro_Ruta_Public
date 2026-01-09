import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../core/models/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/empresas'; // Ajusta según tu main.ts

  getPerfil(): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/perfil`);
  }
}
