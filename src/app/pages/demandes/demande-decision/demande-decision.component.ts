import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion'; // Import correct pour les panneaux expansibles
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-demande-decision',
  standalone: true,
  imports: [ FormsModule,MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatButtonModule, MatIconModule, MatSpinner, MatExpansionModule, CommonModule],
  templateUrl: './demande-decision.component.html',
  styleUrl: './demande-decision.component.scss'
})
export class DemandeDecisionComponent {
  loading = false;
  demande: any = {};


// Méthodes manquantes ajoutées
approveDemande() {
  console.log('Demande approuvée:', this.demande);
}

rejectDemande() {
  console.log('Demande rejetée:', this.demande);
}

goBack() {
  window.history.back();
}






}
