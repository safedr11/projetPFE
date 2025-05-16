import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ Corrigé ici
import { DemandesService } from '../../../services/demandes.service';
import { DemandeModel, TechnicalActionType, TechnicalStatus, Impact, Priorite, Categorie } from '../../../models/demande-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-demande-decision',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './demande-decision.component.html',
  styleUrls: ['./demande-decision.component.scss']
})
export class DemandeDecisionComponent implements OnInit {
  demande: DemandeModel | null = null;
  loading = true;
  isEditable = false;
  isRSSI = false;
  isUpdateUrl = false;

  technicalActionTypes = Object.values(TechnicalActionType);
  technicalStatuses = Object.values(TechnicalStatus);
  impactLevels = Object.values(Impact);
  priorities = Object.values(Priorite);
  categories = Object.values(Categorie);
  demandeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private demandesService: DemandesService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router // ✅ Corrigé ici
  ) {}

  ngOnInit(): void {
    const currentUrl = this.route.snapshot.url.map(segment => segment.path).join('/');
this.isUpdateUrl = currentUrl.includes('mettre-a-jour');
    this.isRSSI = this.authService.isRSSI();
    const id = this.route.snapshot.paramMap.get('id');
    this.demandeId = id;
    console.log('ID de la demande:', id);
    const isDecisionRoute = this.route.snapshot.url.some(segment => segment.path === 'decision');
    this.isEditable = isDecisionRoute;

    if (id) {
      this.demandesService.getDemandeById(id).subscribe({
        next: (demande) => {
          this.demande = demande;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erreur lors du chargement de la demande.', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.loading = false;
    }
  }

  goBack(): void {
    window.history.back();
    // Option recommandée :
    // this.router.navigate(['/chemin/retour']); // <- définis le chemin cible ici
  }

  approveDemande(): void {
    if (this.demande && this.demandeId) {
      this.demandesService.validerDemande(this.demandeId, this.demande, true).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
          this.goBack();
        },
        error: (err) => {
          console.error('Erreur backend :', err);
          this.snackBar.open('Erreur lors de la validation.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  rejectDemande(): void {
    if (this.demande && this.demandeId) {
      this.demandesService.validerDemande(this.demandeId, this.demande, false).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
          this.goBack();
        },
        error: () => {
          this.snackBar.open('Erreur lors du rejet.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  mettrejourDemande(): void {
    if (this.demande && this.demandeId) {
      this.demandesService.updateDemande(this.demandeId, this.demande).subscribe({
        next: (response) => {
          this.snackBar.open('Mise à jour réussie.', 'Fermer', { duration: 3000 });
          this.goBack();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la mise à jour.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
