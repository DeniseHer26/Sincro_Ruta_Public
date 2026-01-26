import { Component, Inject, inject } from '@angular/core';
import { ChoferService } from '../../../../core/services/chofer.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Chofer } from '../../../../core/interfaces/chofer.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-eliminar-chofer-dialog',
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './eliminar-chofer-dialog.component.html',
    styleUrl: './eliminar-chofer-dialog.component.css'
})
export class EliminarChoferDialogComponent {
  private choferService = inject(ChoferService);
  private notify = inject(NotificacionService);
  private dialogRef = inject(MatDialogRef<EliminarChoferDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Chofer) {}

  confirmarEliminacion() {
    this.choferService.eliminarChofer(this.data.idChofer).subscribe({
      next: (res: any) => {
        this.notify.showSuccess(res.message);
        this.dialogRef.close(true);
      },
      error:(err) => {
        this.notify.showError(err.error?.message || 'Error al eliminar chofer');
        this.dialogRef.close(false);
      }
    })
  }
}
