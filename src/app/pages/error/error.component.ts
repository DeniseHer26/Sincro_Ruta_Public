import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-error',
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.css'
})
export class ErrorComponent {
  private route = inject (ActivatedRoute);

  errorCode = this.route.snapshot.data['code'] || '404';
  errorMessage = this.route.snapshot.data['message'] || 'La pagina que buscas no existe.';
}
