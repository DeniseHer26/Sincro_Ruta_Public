import { inject, Injectable, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  // Configuracion tiempo de inactividad, 15 minutos
  // 15 minutos * 60 segundos * 1000 milisegundos
  private readonly TIMEOUT_MS = 15 * 60 * 1000;

  private timeoutId: any;

  constructor() {
    this.initListener();
    this.resetTimer();
  }

  // Escuhar eventos del usuario
  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.resetTimer());
      document.body.addEventListener('mouseover', () => this.resetTimer());
      document.body.addEventListener('keydown', () => this.resetTimer());
    });
  }

  // Reiniciar el contador
  resetTimer() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    clearTimeout(this.timeoutId);

    // Iniciar nuevo contador
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          this.cerrarSesionPorInactividad();
        });
      }, this.TIMEOUT_MS);
    });
  }

  cerrarSesionPorInactividad() {
    console.warn('Cerrando Session por inactividad...');
    this.authService.logout();
    alert('Tu sesion ha expirado por inactividad.');
  }
}
