import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Servicio } from "../interfaces/servicio.interface";
import { FilterServiciosDto } from "../interfaces/filter-servicios.interface";

@Injectable({
  providedIn: 'root'
})

export  class ServicioService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/servicios';

  /**
   * Obtiene todos los servicios con soporte para filtros dinamicos(estatus y fechas)
   * Backend: @Gen() findAll(@Query() filterDto: filterServiciosDto)
   */
  getServicios(filtros?: FilterServiciosDto): Observable<Servicio[]> {
    let params = new HttpParams();

    if(filtros) {
      if(filtros.estatus && filtros.estatus.length > 0) {
        // Para pasar arreglos en la URL
        filtros.estatus.forEach(e => params.append('estatus', e));
      }
      if(filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
      if(filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);
    }
    return this.http.get<Servicio[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un srvicio por ID con sus relaciones
   * Backend: @Get(':id') findOne
   */
  getServicioById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra un nuevo servicio. El backend valida disponibilidad de chofer y unidades de transporte.
   * Backend: @Post() create
   */
  crearServicio(servicio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, servicio);
  }

  /**
   * Actualiza los datos o el estatus de un servicio
   * Backend: @Patch(':id) update
   */
  actualizarServicio(id: number, servicio: any): Observable<Servicio> {
    return this.http.patch<Servicio>(`${this.apiUrl}/${id}`, servicio);
  }

  /**
   * Cancelacion para servicios
   * Backend: @Patch(':id/cancelar') cancel
   */
  cancelarServicio(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancelar`, {})
  }

  /**
   * Elimina un servicio permanentemente
   * Backend: @Delete(':id') remove
   */
  eliminarServicio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
