import { animate, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation = trigger('routeAnimations', [
  // Esta transcion se aplicara a cualquier cambio de ruta (* <=> *)
  transition('* <=> *', [
    // Configuracion inicial para los componentes que se superpongan
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    // Estado inicial del componente que entra (fuera de la pantalla a la derecha)
    query(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 })
    ], { optional: true }),
    group([
      // Mover el componente que sale hacia la izquierda
      query(':leave', [
        // Salida más lenta y suave hacia la izquierda, con desvanecimiento
        animate('900ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ], { optional: true }),
      // Mover el componente que entra desde la derecha hacia el centro (más suave)
      query(':enter', [
        animate('900ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
