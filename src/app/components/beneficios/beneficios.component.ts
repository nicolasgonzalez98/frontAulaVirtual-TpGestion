import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './beneficios.component.html',
  styleUrl: './beneficios.component.css'
})
export class BeneficiosComponent {
  constructor(private router: Router) {}

  irARegistro() {
    this.router.navigate(['/registro-establecimiento']);
  }
}

