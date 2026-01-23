import { Component, inject, ViewChild } from '@angular/core';
import { ServicioService } from '../../core/services/servicio.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificacionService } from '../../core/services/notificacion.service';
import { LoaderService } from '../../core/loader.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Servicio } from '../../core/interfaces/servicio.interface';
import { EstatusServicio } from '../../core/enums/estatus-servicio.enum';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { ServicioDialogComponent } from './components/servicio-dialog/servicio-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  private servicioService = inject(ServicioService);
  private fb = inject(FormBuilder);
  private notify = inject(NotificacionService);
  private loader = inject(LoaderService);
  private dialog = inject(MatDialog);

  public router = inject(Router);


  displayedColumns: string[] = ['idServicio', 'fecha', 'ruta', 'asignacion', 'costo', 'estatus', 'acciones'];
  dataSource = new MatTableDataSource<Servicio>([]);

  filterForm!: FormGroup;
  estatusOptions = Object.values(EstatusServicio);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.initFilterForm();
    this.cargarServicios();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      estatus: [[]],
      fechaInicio: [null],
      fechaFin: [null]
    })
  }

  cargarServicios() {
    this.loader.show();
    const filtros = this.filterForm.value;

    const queryParams: any = {};

    if (filtros.estatus?.length) queryParams.estatus = filtros.estatus;
    if (filtros.fechaInicio) queryParams.fechaInicio = filtros.fechaInicio.toISOString();
    if (filtros.fechaFin) queryParams.fechaFin = filtros.fechaFin.toISOString();

    this.servicioService.getServicios(queryParams).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
        this.notify.showError('Error al cargar los servicios');
      }
    });
  }

  aplicarBusqueda(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  detalleServicio(servicio: Servicio) {
     const dialogRef = this.dialog.open(ServicioDialogComponent, {
      width: '1000px',
      data: servicio,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this.cargarServicios()
      }
    });
  }

  cancelarServicio(id: number) {
    if(confirm('¿Esta seguro de cancelar este servicio? Esta accion no se puede deshacer')) {
      this.servicioService.cancelarServicio(id).subscribe({
        next:(res) => {
          this.notify.showSuccess(res.message);
          this.cargarServicios();
        }
      });
    }
  }

  getEstatusClass(estatus: EstatusServicio): string {
    switch(estatus) {
      case EstatusServicio.PENDIENTE: return 'badge-pending';
      case EstatusServicio.EN_TRANSITO: return 'badge-transit';
      case EstatusServicio.ENTREGADO: return 'badge-success';
      case EstatusServicio.CANCELADO: return 'badge-danger';
      default: return '';
    }
  }
}
