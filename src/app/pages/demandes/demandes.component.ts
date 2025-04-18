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
import { DemandeModel, Statuts, Priorite,Impact,Categorie } from '../../models/demande-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'client', 'description', 'status', 'priorite','niveauImpact','categorie', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<DemandeModel>();
  isLoading = true;
  isAdmin = false;
  isRSSI = false;
  isChangeManager = false;  
  isDBU = false;
  isDSI = false;

  
  // Filtres
  selectedStatus: string = '';
  selectedPriority: string = '';
  selectedImpact: string = '';
  selectedCategorie: string = '';
  statuses: Statuts[] = Object.values(Statuts);
  priorities: Priorite[] = Object.values(Priorite);
  impacts :Impact[]= Object.values(Impact);
  categories :Categorie[]= Object.values(Categorie);

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
    this.isRSSI = this.authService.isRSSI();
    this.isChangeManager = this.authService.isChange_Manger();
    this.isDBU = this.authService.isDBU();
    this.isDSI = this.authService.isDSI();
    this.loadDemandes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  applyFilters(): void {
    const filteredData = this.dataSource.data.filter(demande => {
      const matchesStatus = !this.selectedStatus || demande.status === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || demande.priorite === this.selectedPriority;
      const matchesImpact = !this.selectedImpact || demande.niveauImpact === this.selectedImpact;
      const matchesCategorie = !this.selectedCategorie || demande.categorie === this.selectedCategorie;

      return matchesStatus && matchesPriority && matchesImpact && matchesCategorie;
    });

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedImpact = '';
    this.selectedCategorie = '';
    this.loadDemandes();
  }

  navigateToCreate(): void {
    this.router.navigate(['/home/demandes/nouvelle']);
  }

  viewDemande(id: string): void {
    this.router.navigate(['/home/demandes/details', id]);
  }

  navigateToDecision(id: string): void {
    this.router.navigate(['/home/demandes/decision', id]);
  }

  getStatusClass(status: Statuts): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  getPriorityClass(priority: Priorite): string {
    return `priority-${priority.toLowerCase()}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}