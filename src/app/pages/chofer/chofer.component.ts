import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChoferService } from '../../core/services/chofer.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { LoaderService } from '../../core/loader.service';
import { Chofer } from '../../core/interfaces/chofer.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChoferFormDialogComponent } from './components/chofer-form-dialog/chofer-form-dialog.component';

@Component({
  selector: 'app-chofer',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './chofer.component.html',
  styleUrl: './chofer.component.css'
})
export class ChoferComponent implements OnInit {
  private choferService = inject(ChoferService);
  private notify = inject(NotificacionService);
  private loader = inject(LoaderService);
  private dialog = inject(MatDialog);

  // Definición de columnas a mostrar
  displayedColumns: string[] = ['idChofer', 'nombre', 'licencia', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<Chofer>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.cargarChoferes();
  }

  cargarChoferes() {
    this.loader.show();
    this.choferService.getChoferes().subscribe({
      next: (data) => {
        // Solo mostramos choferes activos por defecto
        this.dataSource.data = data.filter(c => c.active);
        this.dataSource.sort = this.sort;
        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
        this.notify.showError('No se pudo cargar la lista de choferes');
      }
    });
  }

  // Lógica de búsqueda/filtrado
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarChofer(id: number) {
    if (confirm('¿Está seguro de que desea dar de baja a este chofer?')) {
      this.choferService.desactivarChofer(id).subscribe({
        next: () => {
          this.notify.showSuccess('Chofer desactivado correctamente');
          this.cargarChoferes(); // Recargamos la tabla
        }
      });
    }
  }

  abrirFormulario(chofer?: Chofer) {
    const dialogRef = this.dialog.open(ChoferFormDialogComponent, {
      width: '450px',
      data: chofer,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarChoferes(); // Recarga la tabla si hubo cambios
      }
    });
  }

  // Actualizamos los métodos existentes
  nuevoChofer() {
    this.abrirFormulario();
  }

  editarChofer(chofer: Chofer) {
    this.abrirFormulario(chofer);
  }
}
