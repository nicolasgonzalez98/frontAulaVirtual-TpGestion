import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { User, UserForm } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './user-form.component.html',
  styles: [`
    :host ::ng-deep .p-card {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string ="";
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
    console.log(id);
    if (id) {
      this.isEditMode = true;
      this.userId = id;
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
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar el usuario'
      });
      this.router.navigate(['/admin/usuarios']);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.userForm.valid) {
      try {
        this.submitting = true;
        const { confirmPassword, ...rawData } = this.userForm.value;
        const formData = { ...rawData } as UserForm;

        if (!formData.password) {
          delete formData.password;
        }
        formData.rol = formData.rol?.toString().toLowerCase();

        if (this.isEditMode && this.userId) {
          await this.userService.updateUser(this.userId, formData);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario actualizado correctamente'
          });
        } else {
          await this.userService.createUser(formData);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario creado correctamente'
          });
        }

        setTimeout(() => {
          this.router.navigate(['/admin/usuarios']);
        }, 1500);
      } catch (error) {
        
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditMode 
            ? 'No se pudo actualizar el usuario' 
            : 'No se pudo crear el usuario'
        });
      } finally {
        this.submitting = false;
      }
    } else {
      this.markFormGroupTouched(this.userForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  private setPasswordValidators(isRequired: boolean) {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');

    if (isRequired) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(8)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
    }

    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  private passwordsMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (!password && !confirm) {
      return null;
    }

    return password === confirm ? null : { passwordsMismatch: true };
  }

  onCancel() {
    this.router.navigate(['/admin/usuarios']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (fieldName === 'confirmPassword' && this.userForm.errors?.['passwordsMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}

