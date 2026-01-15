import { Component, inject, OnInit, signal } from '@angular/core';
import { EmpresaService } from '../../core/services/empresa.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { Empresa } from '../../core/interfaces/empresa.interface';
import { NotificacionService } from '../../core/services/notificacion.service';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '../../core/loader.service';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatTabsModule, MatIconModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit{
  public static readonly PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
  private empresaService = inject(EmpresaService);
  private fb = inject(FormBuilder);
  private notify = inject(NotificacionService);
  loaderService = inject(LoaderService);

  infoForm!: FormGroup;
  empresaData = signal<Empresa | null>(null);

  isEditing = signal<boolean>(false);

  isEditingLogo = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string>('');
  fileName = signal<string>('');

  passwordForm!: FormGroup;

  isEditingPassword = signal<boolean>(false);

  ngOnInit() {
    this.initForms();
    this.cargarDatos();
  }

  initForms(){
    this.infoForm = this.fb.group({
      nombreEmpresa: [{ value: '', disabled: true }, Validators.required],
      razonSocial: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }, Validators.required],
      giroEmpresarial: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }, Validators.required],
      representanteLegal: [{ value: '', disabled: true }],
      curp: [{ value: '', disabled: true }],
      correoElectronico: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      numeroTelefonico: [{ value: '', disabled: true }]
    });
    this.passwordForm = this.fb.group({
      nuevaContrasena: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(EmpresaComponent.PASSWORD_PATTERN)
      ]],
      confirmarContrasena: [{ value: '', disbled: true }, Validators.required],
      }, { validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('nuevaContrasena')?.value;
    const confirm = g.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { 'mismatch' : true };
  }

  toggleEdit() {
    if (this.isEditing()){
      this.actualizarInformacion();
    } else {
      this.isEditing.set(true);
      this.infoForm.enable();
    }
  }

  toggleEditLogo() {
    if (this.isEditingLogo()) {
      this.subirLogo();
    } else {
      this.isEditingLogo.set(true);
    }
  }

  toggleEditPassword() {
    if(this.isEditingPassword()) {
      this.cambiarContrasena();
  } else {
    this.isEditingPassword.set(true);
    this.passwordForm.enable();
  }
}

  cargarDatos(){
    this.loaderService.show();
    this.empresaService.getPerfil().subscribe({
      next: (data) => {
        this.empresaData.set(data);
        this.infoForm.patchValue(data);
        if(data.logo) {
          this.imagePreview.set(data.logo);
        }
        this.loaderService.hide();
      },
      error: () => this.loaderService.hide()
    });
  }

  // Función para obtener la URL completa del logo
  getLogoUrl(logoName: string | undefined): string {
    if (!logoName || logoName === 'default-logipulse.png') {
      return 'http://localhost:3000/uploads/default-logipulse.png';
    }
    // Si ya es una URL completa (base64 de la previsualización), la devolvemos tal cual
    if (logoName.startsWith('data:image') || logoName.startsWith('http')) {
      return logoName;
    }
    return `http://localhost:3000/uploads/${logoName}`;
  }

  // Método para construir la URL de la imagen de forma segura
  getSafeLogoUrl(filename: string | null | undefined): string {
    const baseUrl = 'http://localhost:3000/uploads';
    // Si no hay nombre, o es el default, devolvemos la ruta al default
    if (!filename || filename === 'default-logipulse.png') {
      return `${baseUrl}/default-logipulse.png`;
    }
    // Si el filename ya es una URL completa (como el preview base64), se regresa tal cual
    if (filename.startsWith('http') || filename.startsWith('data:image')) {
      return filename;
    }
    // De lo contrario, concatenamos con el servidor
    return `${baseUrl}/${filename}`;
  }

  actualizarInformacion() {
    if (this.infoForm.valid) {
      this.loaderService.show();

      // Obtenemos los valores actuales del formulario
    // Usamos getRawValue() por si hay campos deshabilitados que queremos enviar
    const payload = this.infoForm.getRawValue();

    this.empresaService.updatePerfil(payload).subscribe({
      next: (response) => {
        this.loaderService.hide();

        // Notificamos al usuario con el mensaje que viene del backend
        this.notify.showSuccess(response.message || 'Empresa actualizada correctamente');

        // Actualizamos el Signal con los nuevos datos devueltos
        this.empresaData.set(response);

        // Bloqueamos el formulario nuevamente
        this.isEditing.set(false);
        this.infoForm.disable();
      },
      error: (err) => {
        this.loaderService.hide();
        const errorMsg = err?.error?.message || 'Error al actualizar la información';
        this.notify.showError(errorMsg);
      }
    });
  } else {
    this.infoForm.markAllAsTouched();
    this.notify.showError('Por favor, revisa los campos marcados en rojo');
  }
  }

  cancelarEdicion() {
    this.isEditing.set(false);
    this.infoForm.disable();
    this.cargarDatos();
  }

  onFileSelected(event: any) {
    if (!this.isEditingLogo()) return;

    const file: File = event.target.files[0];
    if(file) {
      this.selectedFile.set(file);
      this.fileName.set(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  subirLogo() {
    const archivo = this.selectedFile();

    if (archivo) {
    this.loaderService.show();

    this.empresaService.subirLogo(archivo).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.notify.showSuccess(res.message);

        this.imagePreview.set(res.logoUrl);

        this.isEditingLogo.set(false);
        this.selectedFile.set(null);
        this.fileName.set('');
      },
      error: (err) => {
        this.loaderService.hide();
        this.notify.showError(err?.error?.message || 'Error al subir el logo');
      }
    });
  }
}

  cancelarEdicionLogo() {
    this.isEditingLogo.set(false);
    this.selectedFile.set(null);
    this.fileName.set('');
    this.imagePreview.set(this.empresaData()?.logo || 'http://localhost:3000/uploads/default-logipulse.png');
  }

  cambiarContrasena() {
    if(this.passwordForm.valid) {
      this.loaderService.show();

      // Extraemos el valor del primer campo, que ya pasó las validaciones de patrón y coincidencia
      const nuevaPass = this.passwordForm.get('nuevaContrasena')?.value;

      this.empresaService.updatePassword(nuevaPass).subscribe({
        next: (res) => {
          this.loaderService.hide();

          this.notify.showSuccess(res.message);

          this.cancelarEdicionPassword();
        },
        error: (err) => {
          this.loaderService.hide();

          const erroMsg = err?.error?.message || 'Error al actualizar la contraseña';
          this.notify.showError(erroMsg);
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
      this.notify.showError('Por favor, verifique que la contraseña cumple con los requisitos.');
    }
  }

  cancelarEdicionPassword(){
    this.isEditingPassword.set(false);
    this.passwordForm.reset();
    this.passwordForm.disable();
  }
}
