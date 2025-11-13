import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asistencia-qr',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './asistencia-qr.component.html',
})
export class AsistenciaQrComponent implements OnInit {
  @Input() cursoId?: string; // Si lo pasás desde otro componente
  @Input() idClase?: string;
  qrData: string = '';
  modo: 'geo' | 'noGeo' = 'geo';
  intervalId?: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // obtener ids desde ruta si no vienen como @Input
    this.cursoId = this.cursoId || this.route.snapshot.paramMap.get('cursoId') || '';
    this.idClase = this.idClase || this.route.snapshot.paramMap.get('idClase') || '';

    // Por defecto mostramos el QR impreso (valida ubicación)
    this.setQrGeo('geo');
  }

  // Método para alternar tipo de QR (opcional)
  setQrGeo(modo: 'geo' | 'noGeo') {
    this.modo = modo;

    // detener rotación previa si existía
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    const baseUrl = `http://localhost:4200/asistencia/${this.cursoId}/${this.idClase}`;

    if (modo === 'geo') {
      // QR fijo con geolocalización
      this.qrData = `${baseUrl}?geo=true`;
    } else {
      // QR que cambia cada 30 segundos
      this.actualizarQrNoGeo(baseUrl);
      this.intervalId = setInterval(() => {this.actualizarQrNoGeo(baseUrl), console.log("cambie qr")}, 30000);
    }
  }

  private actualizarQrNoGeo(baseUrl: string) {
    const token = this.generarToken();
    this.qrData = `${baseUrl}?geo=false&token=${token}`;
  }

  private generarToken(): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  printQR() {
    window.print();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

