import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandesService } from '../../../services/demandes.service';
import { DemandeModel } from '../../../models/demande-model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatExpansionModule } from '@angular/material/expansion';

import { MatSelectModule } from '@angular/material/select'; 
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-consultation-demande',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatStepperModule,
    
  ],
  templateUrl: './consultation-demande.component.html',
  styleUrl: './consultation-demande.component.scss'
})
export class ConsultationDemandeComponent {
  demande: DemandeModel | null = null;
  loading = true;
  isEditable = false; // Par défaut, le formulaire est en mode lecture

  constructor(
    private route: ActivatedRoute,
    private demandesService: DemandesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const isDecisionRoute = this.route.snapshot.url.some(segment => segment.path === 'decision');
    this.isEditable = isDecisionRoute; // Active le mode édition si la route contient "decision"

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
    }
  }

  goBack(): void {
    window.history.back();
  }

  approveDemande(): void {
    console.log('Demande approuvée:', this.demande);
  }

  rejectDemande(): void {
    console.log('Demande rejetée:', this.demande);
  }
}
