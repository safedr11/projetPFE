import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandesService } from '../../../services/demandes.service';
import { DemandeModel } from '../../../models/demande-model';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { FrenchDatePipe } from '../french-date.pipe';
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
    MatProgressSpinnerModule, // Correction de "MatProgressSpinne"
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule, // Si utilisé pour les panneaux d'expansion
   CommonModule,
    FrenchDatePipe // Si utilisé pour formater les dates
  ],// Ajoutez les autres modules Angular Material que vous utilisez
  templateUrl: './consultation-demande.component.html',
  styleUrl: './consultation-demande.component.scss'
})
export class ConsultationDemandeComponent {
  demande: DemandeModel | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private demandeService: DemandesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.demandeService.getDemandeById(id).subscribe({
        next: (demande) => {
          this.demande = demande;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // Gérer l'erreur
        }
      });
    }
  }
  goBack(): void {
    window.history.back();
  }
}
