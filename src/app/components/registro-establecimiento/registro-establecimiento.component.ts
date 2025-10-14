import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-establecimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule, HttpClientModule],
  providers: [MessageService],
  templateUrl: './registro-establecimiento.component.html',
  styleUrl: './registro-establecimiento.component.css'
})
export class RegistroEstablecimientoComponent {
  form: FormGroup;
  loading = false;
  direccionValida: boolean | null = null; // null = no validada aún

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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

  async validarDireccion() {
    const direccion = this.form.value.direccion;
    if (!direccion) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Ingrese una dirección antes de validar.' });
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      direccion
    )}&format=json&addressdetails=1&countrycodes=ar`;

    this.loading = true;

    try {
      const results: any = await this.http.get(url).toPromise();

      if (results && results.length > 0) {
        const place = results[0];
        const { lat, lon, display_name, address } = place;

        // Validar país (por si algún resultado extraño no es Argentina)
        if (address?.country_code === 'ar') {
          this.direccionValida = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Dirección válida',
            detail: display_name
          });

          console.log('✅ Dirección válida:', {
            direccion: display_name,
            latitud: parseFloat(lat),
            longitud: parseFloat(lon),
            address
          });
        } else {
          this.direccionValida = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Dirección fuera de Argentina',
            detail: 'Por favor ingresa una dirección dentro de Argentina.'
          });
        }
      } else {
        this.direccionValida = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Dirección no encontrada',
          detail: 'No se pudo validar la dirección ingresada.'
        });
      }
    } catch (err) {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al validar la dirección.'
      });
    } finally {
      this.loading = false;
    }
  }

  onSubmit() {
    if (!this.direccionValida) {
      this.messageService.add({ severity: 'warn', summary: 'Validación requerida', detail: 'Por favor valida la dirección antes de registrar.' });
      return;
    }

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

    console.log('📦 Objeto listo para enviar:', data);

    // Simulación del POST (más adelante conectamos con el backend)
    // setTimeout(() => {
    //   this.loading = false;
    //   this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Establecimiento registrado correctamente.' });
    //   this.router.navigate(['/login']);
    // }, 2000);
  }
}
