import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// Animacion de carga diferida de Angular
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Importacion para el formato de fechas
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    provideHttpClient(
      withInterceptors([authInterceptor, loaderInterceptor])
    ),
    provideZoneChangeDetection(
      { eventCoalescing: true }
    ),
    provideAnimationsAsync()
  ]
};
