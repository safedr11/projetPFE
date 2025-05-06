import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  private maxAttempts: number = 3; // Nombre maximum de tentatives
  private lockoutDuration: number = 30 * 60 * 1000; // 30 minutes en millisecondes

  constructor(
    private authService: AuthService,
    private router: Router,
    private authStateService: AuthStateService
  ) {}

  // Vérifier si l'utilisateur est bloqué
  private isLockedOut(): boolean {
    const lockoutData = localStorage.getItem(`lockout_${this.email}`);
    if (!lockoutData) return false;

    const { lockoutTime } = JSON.parse(lockoutData);
    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - lockoutTime;

    // Si le temps de blocage est écoulé, réinitialiser
    if (timeElapsed >= this.lockoutDuration) {
      this.resetAttempts();
      return false;
    }

    return true;
  }

  // Obtenir le nombre de tentatives restantes
  private getRemainingAttempts(): number {
    const attemptsData = localStorage.getItem(`attempts_${this.email}`);
    if (!attemptsData) return this.maxAttempts;
    return this.maxAttempts - JSON.parse(attemptsData).attempts;
  }

  // Incrémenter le compteur de tentatives
  private incrementAttempts(): void {
    const attemptsData = localStorage.getItem(`attempts_${this.email}`);
    let attempts = attemptsData ? JSON.parse(attemptsData).attempts : 0;
    attempts += 1;
    localStorage.setItem(`attempts_${this.email}`, JSON.stringify({ attempts }));
  }

  // Réinitialiser les tentatives
  private resetAttempts(): void {
    localStorage.removeItem(`attempts_${this.email}`);
    localStorage.removeItem(`lockout_${this.email}`);
  }

  // Définir le temps de blocage
  private setLockout(): void {
    const lockoutTime = new Date().getTime();
    localStorage.setItem(`lockout_${this.email}`, JSON.stringify({ lockoutTime }));
  }

  // Obtenir le temps restant avant déblocage
  private getRemainingLockoutTime(): string {
    const lockoutData = localStorage.getItem(`lockout_${this.email}`);
    if (!lockoutData) return '';

    const { lockoutTime } = JSON.parse(lockoutData);
    const currentTime = new Date().getTime();
    const timeRemaining = this.lockoutDuration - (currentTime - lockoutTime);
    if (timeRemaining <= 0) return '';

    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  onSubmit(): void {
    this.errorMessage = null;

    // Vérifier si l'utilisateur est bloqué
    if (this.isLockedOut()) {
      const remainingTime = this.getRemainingLockoutTime();
      this.errorMessage = `Compte bloqué. Réessayez dans ${remainingTime}.`;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.authStateService.setAuthenticated(true);
        this.resetAttempts(); // Réinitialiser les tentatives après une connexion réussie
        this.router.navigate(['/home/overview']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.incrementAttempts(); // Incrémenter les tentatives échouées

        const remainingAttempts = this.getRemainingAttempts();
        if (remainingAttempts <= 0) {
          this.setLockout();
          this.errorMessage = `Compte bloqué pour 30 minutes après ${this.maxAttempts} tentatives échouées.`;
        } else {
          this.errorMessage = `Email ou mot de passe incorrect. Tentatives restantes : ${remainingAttempts}.`;
        }
      },
    });
  }
}