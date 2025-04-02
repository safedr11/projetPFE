import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { DemandesComponent } from './pages/demandes/demandes.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {path:'profile', component:ProfileComponent},
    
    { path: 'home', component: HomeComponent , canActivate: [authGuard] , children: [
      { path: 'utilisateurs', component: UtilisateursComponent },
      {path: 'catalogue', component: CatalogueComponent},
      {path: 'demandes', component: DemandesComponent}
    ],},

    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  

];
