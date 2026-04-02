import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const newPassword = this.resetForm.get('password')?.value;

      try {
        const { error } = await this.authService.updatePassword(newPassword);
        
        if (error) {
           this.errorMessage = error;
        } else {
           this.successMessage = 'Contraseña actualizada correctamente. Redirigiendo...';
           // Esperar un momento y redirigir
           setTimeout(() => {
             this.router.navigate(['/admin']);
           }, 2000);
        }
      } catch (err: any) {
        this.errorMessage = 'Error inesperado al intentar actualizar la contraseña.';
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
