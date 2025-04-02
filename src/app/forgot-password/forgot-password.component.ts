import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forgot-password',
  standalone:true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [FormsModule,CommonModule]  
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = "Email de réinitialisation envoyé !";
      },
      error: (error) => {
        console.error('Erreur lors de la demande de réinitialisation', error);
        this.message = "Une erreur s'est produite. Veuillez réessayer.";
      }
    });
  }
}