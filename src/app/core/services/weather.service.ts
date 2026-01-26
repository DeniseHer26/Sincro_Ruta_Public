import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicios/clima`

  getForecast(lat: number, lng: number) {
    // Los parámetros viajan a nuestro controlador de NestJS
    return this.http.get(this.apiUrl, {
      params: { lat: lat.toString(), lon: lng.toString()}
  })
}
}
