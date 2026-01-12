import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../core/models/empresa.interface';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/empresas'; // Ajusta según tu main.ts

  getPerfil(): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/perfil`);
  }

  updatePerfil(updateData: Partial<Empresa>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/perfil`, updateData);
  }

  subirLogo(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    return this.http.post(`${this.apiUrl}/perfil/logo`, formData);
  }
}
