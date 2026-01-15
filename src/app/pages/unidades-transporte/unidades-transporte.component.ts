import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UnidadesTransporteService } from '../../core/services/unidades-transporte.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { LoaderService } from '../../core/loader.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UnidadTransporte } from '../../core/interfaces/unidades-transporte.interface';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EstadoOperativo } from '../../core/enums/estado-operativo.enum';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-unidades-transporte',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatInputModule, MatIconModule, MatFormFieldModule, MatLabel, MatPaginatorModule, MatTooltipModule],
  templateUrl: './unidades-transporte.component.html',
  styleUrl: './unidades-transporte.component.css'
})
export class UnidadesTransporteComponent implements OnInit {
  private unidadesService = inject(UnidadesTransporteService);
  private notify = inject(NotificacionService);
  private loader = inject(LoaderService);

  // Columnas a mostrar basadas en tu Entity
  displayedColumns: string[] = ['placas', 'tipoUnidad', 'chofer', 'capacidad', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<UnidadTransporte>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.cargarUnidades();
  }

  cargarUnidades() {
    this.loader.show();
    this.unidadesService.getUnidades().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        // Configuración de filtrado para buscar también en el nombre del chofer
        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.placas} ${data.tipoUnidad} ${data.chofer?.nombre || ''}`.toLowerCase();
          return searchStr.includes(filter);
        };

        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
        this.notify.showError('No se pudo cargar la flota de unidades');
      }
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarUnidad(id: number) {
    if (confirm('¿Desea dar de baja esta unidad? Se desvinculará al chofer automáticamente.')) {
      this.unidadesService.deleteUnidad(id).subscribe({
        next: (res) => {
          this.notify.showSuccess(res.message);
          this.cargarUnidades();
        }
      });
    }
  }

  // Helper para las clases de los badges
  getEstadoClass(estado: EstadoOperativo): string {
    switch (estado) {
      case EstadoOperativo.DISPONIBLE: return 'status-available';
      case EstadoOperativo.EN_RUTA: return 'status-transit';
      case EstadoOperativo.MANTENIMIENTO: return 'status-maintenance';
      case EstadoOperativo.FUERO_DE_SERVICIO: return 'status-out';
      default: return '';
    }
  }
}
