import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../interfaces/empresa.interface';
import { formatDate } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private http = inject(HttpClient);
  // URL base apuntando al controlador 'empresas'
  private apiUrl = `${environment.apiUrl}/empresas`;

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

  updatePassword(password: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/perfil/password`, { contrasena: password });
  }
}
