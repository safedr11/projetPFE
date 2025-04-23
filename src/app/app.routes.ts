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
import { DemandeFormComponent } from './pages/demandes/demande-form/demande-form.component';
import { ConsultationDemandeComponent } from './pages/demandes/consultation-demande/consultation-demande.component';
import { DemandeDecisionComponent } from './pages/demandes/demande-decision/demande-decision.component';
import { DashboardComponent } from './dashboard/dashboard.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'utilisateurs', component: UtilisateursComponent },
      { path: 'catalogue', component: CatalogueComponent },
      {
        path: 'demandes',
        children: [
          { path: '', component: DemandesComponent }, // /home/demandes
          { path: 'nouvelle', component: DemandeFormComponent }, // /home/demandes/nouvelle
          { path: ':id/modifier', component: DemandeFormComponent },
          { path: 'details/:id', component: ConsultationDemandeComponent },
          { path: 'decision/:id', component:DemandeDecisionComponent },
         
          
        ]

      },
      { path: 'overview', component:DashboardComponent },
    ]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
  

