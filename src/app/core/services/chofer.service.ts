import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chofer } from '../interfaces/chofer.interface';
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private http = inject(HttpClient);
  // URL base apuntando a tu controlador 'choferes'
  private readonly apiUrl = `${environment.apiUrl}/choferes`;

  /**
   * Obtiene todos los choferes activos de la empresa.
   * Backend: @Get() findAll(@CurrentUser() user: JwtPayload)
   */
  getChoferes(): Observable<Chofer[]> {
    return this.http.get<Chofer[]>(this.apiUrl);
  }

  /**
   * Obtiene un chofer específico por su ID.
   * Backend: @Get(':id') findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string)
   */
  getChoferById(id: number): Observable<Chofer> {
    return this.http.get<Chofer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo chofer.
   * Backend: @Post() crearChofer(@CurrentUser() user: JwtPayload, @Body() createChofereDto: CreateChofereDto)
   */
  crearChofer(chofer: Partial<Chofer>): Observable<any> {
    return this.http.post<Chofer>(this.apiUrl, chofer);
  }

  /**
   * Actualiza la información de un chofer.
   * Backend: @Patch(':id') update(@Param('id') id: string, @Body() updateChofereDto: UpdateChofereDto, @CurrentUser() user: JwtPayload)
   */
  actualizarChofer(id: number, chofer: Partial<Chofer>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, chofer);
  }

  /**
   * Realiza la eliminación lógica del chofer.
   * Backend: @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: JwtPayload)
   */
  eliminarChofer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
