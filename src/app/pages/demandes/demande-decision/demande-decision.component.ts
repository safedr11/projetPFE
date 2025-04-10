import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandesService } from '../../../services/demandes.service';
import { DemandeModel } from '../../../models/demande-model';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './demande-decision.component.html',
  styleUrls: ['./demande-decision.component.scss']
})
export class DemandeDecisionComponent implements OnInit {
  demande: DemandeModel | null = null; // Contient les données de la demande
  loading = true; // Indique si les données sont en cours de chargement
  isEditable = false; // Active le mode édition si nécessaire

  constructor(
    private route: ActivatedRoute,
    private demandesService: DemandesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Récupère l'ID de la demande depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    const isDecisionRoute = this.route.snapshot.url.some(segment => segment.path === 'decision');
    this.isEditable = isDecisionRoute; // Active le mode édition si la route contient "decision"

    if (id) {
      // Charge les données de la demande via le service
      this.demandesService.getDemandeById(id).subscribe({
        next: (demande) => {
          this.demande = demande; // Associe les données récupérées à la propriété `demande`
          this.loading = false; // Désactive le spinner de chargement
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erreur lors du chargement de la demande.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  // Méthode pour retourner à la page précédente
  goBack(): void {
    window.history.back();
  }

  // Méthode pour approuver la demande
  approveDemande(): void {
    if (this.demande) {
      console.log('Demande approuvée:', this.demande);
      this.snackBar.open('Demande approuvée avec succès.', 'Fermer', { duration: 3000 });
    }
  }

  // Méthode pour rejeter la demande
  rejectDemande(): void {
    if (this.demande) {
      console.log('Demande rejetée:', this.demande);
      this.snackBar.open('Demande rejetée avec succès.', 'Fermer', { duration: 3000 });
    }
  }
}
