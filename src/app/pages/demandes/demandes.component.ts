import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { DemandesService } from '../../services/demandes.service';
import { AuthService } from '../../services/auth.service';
import { DemandeModel, Statuts, Priorite } from '../../models/demande-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,MatInputModule,MatFormFieldModule
  ],
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'client', 'description', 'status', 'priorite', 'createdAt'];
  dataSource = new MatTableDataSource<DemandeModel>();
  isLoading = true;
  isAdmin = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private demandesService: DemandesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.adjustColumns();
    this.loadDemandes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  adjustColumns(): void {
   
      this.displayedColumns.push('actions');
    
  }

  loadDemandes(): void {
    this.demandesService.getDemandes().subscribe({
      next: (demandes) => {
        this.dataSource.data = demandes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
        this.snackBar.open('Erreur lors du chargement des demandes', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/home/demandes/nouvelle']);
  }

  editDemande(id: string): void {
    this.router.navigate(['/home/demandes', id, 'modifier']);
  }

  deleteDemande(id: string): void {
    // Implémentez la logique de suppression ici
    console.log('Suppression de la demande', id);
    this.snackBar.open('Fonctionnalité de suppression à implémenter', 'Fermer', {
      duration: 3000
    });
  }

  getStatusClass(status: Statuts): string {
    return status.toLowerCase().replace('_', '-');
  }

  getPriorityClass(priority: Priorite): string {
    return priority.toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  viewDemande(id: string): void {
    this.router.navigate(['/home/demandes', id]);
  }
}