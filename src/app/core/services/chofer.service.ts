import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chofer } from "../interfaces/chofer.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/choferes';

  getChoferes(): Observable<Chofer[]> {
    return this.http.get<Chofer[]>(this.apiUrl);
  }

  getChoferById(id: number): Observable<Chofer> {
    return this.http.get<Chofer>(`${this.apiUrl}/${id}`);
  }

  crearChofer(chofer: Partial<Chofer>): Observable<any> {
    return this.http.post<Chofer>(this.apiUrl, chofer);
  }

  actualizarChofer(id: number, chofer: Partial<Chofer>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, chofer);
  }

  desactivarChofer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
