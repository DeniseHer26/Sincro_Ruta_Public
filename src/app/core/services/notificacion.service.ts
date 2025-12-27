import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private snackBar = inject(MatSnackBar);

  // Configuracion para todos los avisos
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom'
  };

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Aceptar', {
      ...this.defaultConfig,
      panelClass: ['success-snackbar']
    });
  }

  shownError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      panelClass:['error-snackbar']
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'Entendido', {
      ...this.defaultConfig,
      panelClass: ['info-snackbar']
    })
  }
}
