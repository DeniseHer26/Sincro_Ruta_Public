import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { Observable, map, of } from 'rxjs';

import { ServicioService } from '../../../../core/services/servicio.services';
import { Servicio } from '../../../../core/interfaces/servicio.interface';
import { EstatusServicio } from '../../../../core/enums/estatus-servicio.enum';
import { LoaderService } from '../../../../core/loader.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, inject, OnInit, signal } from '@angular/core';

@Component({
    selector: 'app-servicio-dialog',
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
        MatDividerModule, GoogleMapsModule],
    templateUrl: './servicio-dialog.component.html',
    styleUrl: './servicio-dialog.component.css'
})
export class ServicioDialogComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private directionsService = inject(MapDirectionsService);
  private loader = inject(LoaderService);

  servicio = signal<Servicio | null>(null);
  directionsResults$: Observable<google.maps.DirectionsResult | undefined> = of(undefined);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Servicio,
    private dialogRef: MatDialogRef<ServicioDialogComponent>
  ) {}

  ngOnInit() {
    this.cargarDetalle();
  }

  cargarDetalle() {
    this.loader.show();
    this.servicioService.getServicioById(this.data.idServicio).subscribe({
      next: (data) => {
        this.servicio.set(data);
        this.trazarRuta(data.puntoOrigen, data.puntoDestino);
        this.loader.hide();
      },
      error: () => this.loader.hide()
    });
  }

  trazarRuta(origen: string, destino: string) {
    const request: google.maps.DirectionsRequest = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsResults$ = this.directionsService.route(request).pipe(
      map(response => response.result)
    );
  }

  getEstatusClass(estatus: EstatusServicio): string {
    switch (estatus) {
      case EstatusServicio.PENDIENTE: return 'badge-pending';
      case EstatusServicio.EN_TRANSITO: return 'badge-transit';
      case EstatusServicio.ENTREGADO: return 'badge-success';
      case EstatusServicio.CANCELADO: return 'badge-danger';
      default: return '';
    }
  }
}
