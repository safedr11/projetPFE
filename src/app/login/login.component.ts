import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router,RouterModule } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,  CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private authStateService: AuthStateService
  ) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.authStateService.setAuthenticated(true);
        this.router.navigate(['/home']); // Rediriger vers le tableau de bord
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }

}
