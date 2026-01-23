// src/app/core/services/weather.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = environment.OPENWEATHER_API_KEY;

  getForecast(lat: number, lng: number) {
    // Obtenemos el clima basado en las coordenadas del destino
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric&lang=es`);
  }
}
