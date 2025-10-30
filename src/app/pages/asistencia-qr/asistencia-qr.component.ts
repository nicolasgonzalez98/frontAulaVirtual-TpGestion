import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-asistencia-qr',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './asistencia-qr.component.html',
})
export class AsistenciaQrComponent implements OnInit {
  @Input() idClase?: string; // Si lo pasás desde otro componente
  qrData: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Si viene por parámetro de la ruta
    this.idClase = this.idClase || this.route.snapshot.paramMap.get('idClase') || '';

    // URL que los alumnos escanearán (ajustala según tu dominio real)
    this.qrData = environment.api_url_dev+`/asistencias/`;
  }
}

