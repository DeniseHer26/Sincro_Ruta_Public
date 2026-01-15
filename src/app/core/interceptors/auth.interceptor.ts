import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token_logipulse') || sessionStorage.getItem('token_logipulse');

  let requestToForward = req;

  if (token) {
    requestToForward = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(requestToForward).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejo de errores de Navegacion
      if(error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 404) {
        // Captura de URLs mal formadas o recursos inexistentes
        router.navigate(['/not-found']);
      } else if (error.status === 500) {
        router.navigate(['server-error']);
      }
      return throwError(() =>error);
    })
  );
};

