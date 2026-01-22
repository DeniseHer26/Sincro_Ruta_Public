import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UnidadTransporte } from "../interfaces/unidades-transporte.interface";
import { EstadoOperativo } from "../enums/estado-operativo.enum";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})

export class UnidadesTransporteService {
  private http = inject(HttpClient);
  // URL base apuntando a tu controlador 'unidades-transporte'
  private readonly apiUrl = `${environment.apiUrl}/unidades-transporte`;

  /**
   * Obtiene todas las unidades de la empresa (activas)
   * Backend: @Get() findAll
   */
  getUnidades(): Observable<UnidadTransporte[]> {
    return this.http.get<UnidadTransporte[]>(this.apiUrl);
  }

  /**
   * Obtiene una unidad por ID
   * Backend: @Get(':id') findOne
   */
  getUnidadById(id: number): Observable<UnidadTransporte> {
    return this.http.get<UnidadTransporte>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva unidad
   * Backend: @Post() create
   */
  createUnidad(unidad: Partial<UnidadTransporte>): Observable<any> {
    return this.http.post<any>(this.apiUrl, unidad);
  }

  /**
   * Actualiza una unidad existente
   * Backend: @Patch(':id') update
   */
  updateUnidad(id: number, unidad: Partial<UnidadTransporte>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, unidad);
  }

  /**
   * Elimina (soft delete) una unidad
   * Backend: @Delete(':id') remove
   */
  deleteUnidad(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Asigna un chofer a una unidad específica
   * Backend: @Patch(':id/asignar-chofer/:choferId') assignChofer
   */
  asignarChofer(idUnidad: number, idChofer: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${idUnidad}/asignar-chofer/${idChofer}`, {});
  }

  /**
   * Desvincula al chofer de la unidad
   * Backend: @Patch(':id/desvincular-chofer') unassignChofer
   */
  desvincularChofer(idUnidad: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${idUnidad}/desvincular-chofer`, {});
  }

  /**
   * Método específico para filtrar unidades por su estado operativo en el cliente
   * Esto es útil para los filtros rápidos en la tabla de la interfaz
   */
  getUnidadesByEstado(estado: EstadoOperativo): Observable<UnidadTransporte[]> {
    return this.getUnidades().pipe(
      map(unidades => unidades.filter(u => u.estadoOperativo === estado))
    );
  }
}
