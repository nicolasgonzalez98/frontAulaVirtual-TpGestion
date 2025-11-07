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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Si viene por parámetro de la ruta
    this.cursoId = this.cursoId || this.route.snapshot.paramMap.get('cursoId') || '';
    this.idClase = this.idClase || this.route.snapshot.paramMap.get('idClase') || '';

    // URL que los alumnos escanearán (ajustala según tu dominio real)
    this.qrData = `http://localhost:4200/asistencia/${this.cursoId}/${this.idClase}`;

    // ✅ 2 versiones de QR
    const urlConGeo = `${this.qrData}?geo=true`; // QR impreso (valida ubicación)
    const urlSinGeo = `${this.qrData}?geo=false`; // QR mostrado en pantalla

    // Por defecto mostramos el QR impreso (para imprimir)
    this.qrData = urlConGeo;
  }

  // Método para alternar tipo de QR (opcional)
  setQrGeo(modo: 'geo' | 'noGeo') {
    const baseUrl = `http://localhost:4200/asistencia/${this.cursoId}/${this.idClase}`;
    this.qrData = modo === 'geo'
      ? `${baseUrl}?geo=true`
      : `${baseUrl}?geo=false`;
  }

  printQR() {
    window.print();
  }
}

