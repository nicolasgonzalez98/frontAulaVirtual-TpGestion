import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-establecimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './registro-establecimiento.component.html',
  styleUrl: './registro-establecimiento.component.css'
})
export class RegistroEstablecimientoComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [''],
      emailEstablecimiento: ['', [Validators.required, Validators.email]],
      responsableNombre: ['', Validators.required],
      responsableEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    this.loading = true;

    const data = {
      nombre: this.form.value.nombre,
      direccion: this.form.value.direccion,
      telefono: this.form.value.telefono,
      email: this.form.value.emailEstablecimiento,
      responsable: {
        nombre: this.form.value.responsableNombre,
        email: this.form.value.responsableEmail,
        password: this.form.value.password
      }
    };

    // Simulación del POST (más adelante conectamos con el backend)
    setTimeout(() => {
      this.loading = false;
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Establecimiento registrado correctamente.' });
      this.router.navigate(['/login']);
    }, 2000);
  }
}
