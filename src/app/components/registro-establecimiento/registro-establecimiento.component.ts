import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { EstablecimientosService } from '../../../services/establecimientoService';


declare const google: any;
@Component({
  selector: 'app-registro-establecimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule, HttpClientModule],
  providers: [MessageService],
  templateUrl: './registro-establecimiento.component.html',
  styleUrl: './registro-establecimiento.component.css'
})


export class RegistroEstablecimientoComponent implements AfterViewInit {
  @ViewChild('direccionInput') direccionInput!: ElementRef<HTMLInputElement>;

  form: FormGroup;
  loading = false;
  direccionValida: boolean | null = null;
  latitud: number | null = null;
  longitud: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private establecimientosService: EstablecimientosService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [''],
      emailEstablecimiento: ['', [Validators.required, Validators.email]],
      responsableNombre: ['', Validators.required],
      responsableApellido: ['', Validators.required],
      responsableEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.googleMapsLoader.load(() => this.initAutocomplete());
  }

  private initAutocomplete(): void {
    if (!('google' in window)) {
      console.error('❌ Google Maps no se cargó correctamente.');
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      this.direccionInput.nativeElement,
      {
        componentRestrictions: { country: 'ar' },
        fields: ['geometry', 'formatted_address']
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        this.form.patchValue({ direccion: place.formatted_address });
        this.latitud = place.geometry.location?.lat() ?? null;
        this.longitud = place.geometry.location?.lng() ?? null;
        this.direccionValida = true;

        console.log('✅ Dirección seleccionada:', place.formatted_address);
        console.log('📍 Coordenadas:', this.latitud, this.longitud);

        this.messageService.add({
          severity: 'success',
          summary: 'Dirección seleccionada',
          detail: place.formatted_address
        });
      } else {
        this.direccionValida = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'No se encontró la dirección',
          detail: 'Por favor seleccione una sugerencia válida.'
        });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.touched && control.invalid);
  }

  onSubmit() {
    if (!this.direccionValida) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación requerida',
        detail: 'Seleccioná una dirección válida de las sugerencias.'
      });
      return;
    }

    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor completá todos los campos requeridos.'
      });
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden.'
      });
      return;
    }

    const data = {
      nombre: this.form.value.nombre,
      direccion: this.form.value.direccion,
      telefono: this.form.value.telefono,
      email: this.form.value.emailEstablecimiento,
      latitud: this.latitud,
      longitud: this.longitud,
      responsable: {
        nombre: this.form.value.responsableNombre,
        apellido: this.form.value.responsableApellido,
        email: this.form.value.responsableEmail,
        password: this.form.value.password
      }
    };

    console.log('📦 Objeto listo para enviar:', data);

    this.establecimientosService.crearEstablecimiento(data).subscribe({
      next: (response) => {
        console.log('✅ Establecimiento creado:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Establecimiento registrado correctamente.'
        });
        this.router.navigate(['/login']); // o donde quieras redirigir
      },
      error: (err) => {
        console.error('❌ Error al crear establecimiento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el establecimiento.'
        });
      }
    });
    
  }
}

