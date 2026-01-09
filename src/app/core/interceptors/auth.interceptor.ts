import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token con la clave correcta (logipulse)
  const token = localStorage.getItem('token_logipulse') || sessionStorage.getItem('token_logipulse');

  // Si el token existe, clonar la petición y añadir el header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, enviar la petición original (como en el Login)
  return next(req);
};

