import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ChoferService } from '../../../../core/services/chofer.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { Chofer } from '../../../../core/interfaces/chofer.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chofer-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './chofer-form-dialog.component.html',
  styleUrl: './chofer-form-dialog.component.css'
})

export class ChoferFormDialogComponent implements OnInit{
  private fb = inject(FormBuilder);
  private choferService = inject(ChoferService);
  private notify = inject(NotificacionService);
  private dialogRef = inject(MatDialogRef<ChoferFormDialogComponent>);

  choferForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Chofer) {
    this.isEditMode = !!data;
  }

  ngOnInit() {
    this.initForm();
    if (this.isEditMode) {
      this.choferForm.patchValue(this.data);
    }
  }

  initForm() {
    this.choferForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      licencia: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.maxLength(20)]]
    });
  }

  guardar() {
    if (this.choferForm.invalid) return;

    const payload = this.choferForm.value;

    if (this.isEditMode) {
      this.choferService.actualizarChofer(this.data.idChofer, payload).subscribe({
        next: (res) => {
          this.notify.showSuccess(res.message);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.choferService.crearChofer(payload).subscribe({
        next: (res) => {
          this.notify.showSuccess(res.message);
          this.dialogRef.close(true);
        }
      });
    }
  }

  cancelar(): void{
    this.dialogRef.close();
  }
}
