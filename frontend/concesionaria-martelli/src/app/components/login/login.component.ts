import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  resetMessage: string = '';
  isLoading: boolean = false;
  isResetLoading: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      try {
        const { data, error } = await this.authService.login(email, password);
        
        if (error) {
          this.errorMessage = 'Credenciales inválidas. Por favor, intente nuevamente.';
        } else {
          // Login exitoso, redirigir al área de administración
          this.router.navigate(['/admin']);
        }
      } catch (err: any) {
        this.errorMessage = 'Ocurrió un error al intentar iniciar sesión.';
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  async onResetPassword() {
    this.errorMessage = '';
    this.resetMessage = '';
    
    const emailControl = this.loginForm.get('email');
    if (!emailControl?.value || emailControl.invalid) {
      this.errorMessage = 'Por favor, ingrese un correo válido para recuperar la contraseña.';
      emailControl?.markAsTouched();
      return;
    }

    this.isResetLoading = true;
    try {
      const { error } = await this.authService.resetPassword(emailControl.value);
      if (error) {
         this.errorMessage = 'Error al procesar la solicitud. ' + error;
      } else {
         this.resetMessage = 'Se ha enviado un enlace de recuperación a su correo electrónico.';
      }
    } catch (err: any) {
      this.errorMessage = 'Ocurrió un error inesperado al solicitar el restablecimiento.';
    } finally {
      this.isResetLoading = false;
      this.cdr.detectChanges();
    }
  }
}
