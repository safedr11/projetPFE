(window as any).global = window;

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser'
import {  withFetch } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';


bootstrapApplication(AppComponent, {
  providers: [
    MatNativeDateModule,
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync('noop'), // Fournit HttpClient pour toute l'application
 provideClientHydration(), provideAnimationsAsync(),MatChipsModule] // Fournit le service de client hydration],
}).catch((err) => console.error(err));

// Compare this snippet from src/app/app.component.ts: