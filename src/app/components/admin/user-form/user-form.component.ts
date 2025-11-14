import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CardModule, InputTextModule,
    DropdownModule, InputSwitchModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  isEditMode = false;
  userId: string = "";
  loading = false;
  submitting = false;

  roles = [
    { label: 'Estudiante', value: 'alumno' },
    { label: 'Profesor', value: 'docente' },
    { label: 'Administrador', value: 'admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      telefono: [''],
      rol: ['alumno', Validators.required],
      active: [true]
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.userId = id;      // 🔥🔥🔥 ESTO ERA LO QUE FALTABA
      await this.loadUser(id);
    }
  }

  async loadUser(id: string) {
    try {
      this.loading = true;
      const user = await this.userService.getUserById(id);

      this.userForm.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        dni: user.dni,
        telefono: user.telefono || '',
        rol: user.rol,
        active: user.active
      });

    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el usuario' });
      this.router.navigate(['/admin/users']);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (!this.userForm.valid) {
      this.markFormGroupTouched(this.userForm);
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete los campos requeridos' });
      return;
    }

    try {
      this.submitting = true;

      if (this.isEditMode) {
        await this.userService.updateUser(this.userId, this.userForm.value);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
      } else {
        await this.userService.createUser(this.userForm.value);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
      }

      setTimeout(() => this.router.navigate(['/admin/users']), 1500);

    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.isEditMode ? 'No se pudo actualizar el usuario' : 'No se pudo crear el usuario',
      });
    } finally {
      this.submitting = false;
    }
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }

  isFieldInvalid(name: string) {
    const field = this.userForm.get(name);
    return field && field.invalid && (field.dirty || field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'DNI debe tener 7 u 8 dígitos';
    }
    return '';
  }

  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => control.markAsTouched());
  }
}
