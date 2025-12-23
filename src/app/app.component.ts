import { Component, inject } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';

import { AutoLogoutService } from './core/auto-logout.service';
// Animacion de transcision
import { slideInAnimation } from './components/animations/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [slideInAnimation]
})
export class AppComponent {
  private AutoLogoutService = inject(AutoLogoutService);

  // Inyectamos ChildrenOutContexts para obtener datos de la ruta activa
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
