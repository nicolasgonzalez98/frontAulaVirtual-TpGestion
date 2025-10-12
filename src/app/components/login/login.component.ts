import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, DialogModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showRegisteredDialog = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Mostrar diálogo si el usuario fue recién registrado
    this.route.queryParams.subscribe(params => {
      if (params['registrado'] === 'true') {
        this.showRegisteredDialog = true;
        this.location.replaceState(this.router.url.split('?')[0]);
      }
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const res = await this.authService.login(this.loginForm.value);

      // Guardar token y redirigir al home o dashboard
      localStorage.setItem('token', res.token);
      this.successMessage = 'Inicio de sesión exitoso';
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Credenciales incorrectas';
    } finally {
      this.loading = false;
    }
  }
}
