import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AutoLogoutService } from './core/auto-logout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private AutoLogoutService = inject(AutoLogoutService);
}
