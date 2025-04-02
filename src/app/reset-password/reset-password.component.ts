import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    console.log("Token récupéré depuis l'URL:", this.token);
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 3000); // Redirection après 3 sec
      },
      error: (err) => {
        this.error = err.error?.message || "Erreur inconnue lors de la réinitialisation.";
        this.message = '';
      }
    });
  }
}
