import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from "../../../../node_modules/@angular/router/index";
import { CustomSidenavComponent } from "../custom-sidenav/custom-sidenav.component";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, RouterOutlet, CustomSidenavComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
}
