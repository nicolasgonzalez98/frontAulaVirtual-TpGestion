import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AxiosAuthService } from '../../../services/axiosAuthService';

@Component({
  selector: 'app-asistencia-registro',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './asistencia-registro.component.html'
})
export class AsistenciaRegistroComponent implements OnInit {
  cursoId: string = '';
  claseId: string = '';
  loading: boolean = true;
  resultado: string = '';

  constructor(
    private route: ActivatedRoute,
    private axiosAuth: AxiosAuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get('cursoId') || '';
    this.claseId = this.route.snapshot.paramMap.get('claseId') || '';

    // 👇 agregamos esto
    const geoRequired = this.route.snapshot.queryParamMap.get('geo') === 'true';

    if (!this.cursoId || !this.claseId) {
      this.resultado = 'Error: datos inválidos en el enlace QR';
      this.loading = false;
      return;
    }

    try {
      let body: any = {};

      if (geoRequired) {
        // solo pedimos ubicación si geo=true
        const position = await this.getCurrentPosition({ timeout: 10000 });
        body.latitude = position.coords.latitude;
        body.longitude = position.coords.longitude;
        body.geo = true
      }

      const response = await this.axiosAuth.client.post(
        `/asistencias/cursos/${this.cursoId}/${this.claseId}/asistencia`,
        body
      );

      this.resultado = response.data.message || 'Asistencia registrada correctamente';
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.resultado });
    } catch (err: any) {

      if (err && err.code !== undefined) {
        let msg = err.response.data.message;
        if (err.code === 1) msg = 'Permiso denegado para acceder a la ubicación.';
        if (err.code === 2) msg = 'No se pudo determinar la ubicación.';
        if (err.code === 3) msg = 'Tiempo de espera agotado al obtener ubicación.';
        this.resultado = msg;
        this.messageService.add({ severity: 'warn', summary: 'Ubicación', detail: msg });
      } else {
        const msg = err?.response?.data?.message || 'Error al registrar la asistencia';
        this.resultado = msg;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      }
    } finally {
      this.loading = false;
    }
  }

    // Helper para obtener posición con Promise
  private getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({ message: 'Geolocalización no soportada' });
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}

