import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { UnidadesTransporteService } from '../../../../core/services/unidades-transporte.service';
import { ChoferService } from '../../../../core/services/chofer.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { EstadoOperativo } from '../../../../core/enums/estado-operativo.enum';
import { Chofer } from '../../../../core/interfaces/chofer.interface';
import { UnidadTransporte } from '../../../../core/interfaces/unidades-transporte.interface';
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-unidad-transporte-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatDialogModule],
  templateUrl: './unidad-transporte-form-dialog.component.html',
  styleUrl: './unidad-transporte-form-dialog.component.css'
})
export class UnidadTransporteFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private unidadesService = inject(UnidadesTransporteService);
  private choferService = inject(ChoferService);
  private notify = inject(NotificacionService);
  private dialogRef = inject(MatDialogRef<UnidadTransporteFormDialogComponent>);

  unidadForm!: FormGroup;
  isEditMode: boolean = false;
  isReadOnly: boolean = false;

  // Lista de choferes para el dropdown
  choferes = signal<Chofer[]>([]);

  // Tipos de unidad predefinidos para LogiPulse
  tiposUnidad = ['Camioneta 1.5 Ton', 'Camioneta 3.5 Ton', 'Rabón', 'Torton', 'Tráiler'];
  estados = Object.values(EstadoOperativo);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { unidad: UnidadTransporte, isReadOnly: boolean }
    ){
      this.isEditMode = !!data.unidad;
      this.isReadOnly = data.isReadOnly;
    }

  ngOnInit() {
    this.initForm();
    this.cargarChoferes();
    if (this.isEditMode) {
      this.unidadForm.patchValue(this.data.unidad);
    } if (this.isReadOnly) {
      this.unidadForm.disable();
    }
  }

  initForm() {
    this.unidadForm = this.fb.group({
      placas: ['', [Validators.required, Validators.maxLength(20)]],
      tipoUnidad: ['', Validators.required],
      capacidadCarga: [0, [Validators.required, Validators.min(1)]],
      altura: [0, Validators.required],
      largo: [0, Validators.required],
      estadoOperativo: [EstadoOperativo.DISPONIBLE],
      idChofer: [null], // Campo para la lista desplegable
      tieneRefrigeracion: [false]
    });
  }

  cargarChoferes() {
    this.choferService.getChoferes().subscribe({
      next: (list) => this.choferes.set(list),
      error: () => this.notify.showError('Error al cargar lista de choferes')
    });
  }

  guardar() {
    if (this.unidadForm.invalid || this.isReadOnly) return;
    const payload = this.unidadForm.getRawValue(); // getRawValue obtiene datos incluso si están disabled

    const request = this.isEditMode
      ? this.unidadesService.updateUnidad(this.data.unidad.idUnidadTransporte, payload)
      : this.unidadesService.createUnidad(payload);

    request.subscribe({
      next: (res: any) => {
        this.notify.showSuccess(res.message);
        this.dialogRef.close(true);
      },
      error: (err) => this.notify.showError(err.error?.message || 'Error en la operación')
    });
  }

  cancelar(): void{
    this.dialogRef.close();
  }
}
