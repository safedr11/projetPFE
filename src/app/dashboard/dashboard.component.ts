import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as Papa from 'papaparse';
import { DemandesService } from '../services/demandes.service';
import { DemandeAttributeStatsDTO } from '../demande-attribute-stats-dto'; 
import { prepareChartData, generateColors } from '../utils/chart-utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTableModule,
    NgChartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  stats = signal<DemandeAttributeStatsDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  gridCols = signal(2);
  chartType = signal<ChartType>('bar');
  showTable = signal(false);
  chartLoading = signal(false);

  impactChartData = signal<ChartData<'bar'> | ChartData<'pie'>>({ labels: [], datasets: [] });
  prioriteChartData = signal<ChartData<'bar'> | ChartData<'pie'>>({ labels: [], datasets: [] });
  sourceChartData = signal<ChartData<'bar'> | ChartData<'pie'>>({ labels: [], datasets: [] });
  statutChartData = signal<ChartData<'bar'> | ChartData<'pie'>>({ labels: [], datasets: [] });

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} demandes`,
        },
      },
    },
    animation: {
      duration: 500,
    },
  };

  constructor(
    private demandesService: DemandesService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.gridCols.set(result.matches ? 1 : 2);
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(forceRefresh: boolean = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.demandesService.fetchStats(forceRefresh).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        this.prepareChartData();
      },
      error: () => {
        this.error.set('Échec du chargement des statistiques');
        this.loading.set(false);
      },
    });
  }

  prepareChartData(): void {
    const stats = this.stats();
    if (!stats) return;

    const colors = generateColors(4); // Base colors for bar charts
    const currentChartType = this.chartType();

    this.impactChartData.set(prepareChartData(stats.parImpact, 'Impact', colors[0], currentChartType));
    this.prioriteChartData.set(prepareChartData(stats.parPriorite, 'Priorité', colors[1], currentChartType));
    this.sourceChartData.set(prepareChartData(stats.parSource, 'Source', colors[2], currentChartType));
    this.statutChartData.set(prepareChartData(stats.parStatut, 'Statut', colors[3], currentChartType));
  }

  toggleChartType(): void {
    this.chartLoading.set(true);
    setTimeout(() => {
      this.chartType.set(this.chartType() === 'bar' ? 'pie' : 'bar');
      this.prepareChartData();
      this.chartLoading.set(false);
    }, 300);
  }

  toggleView(): void {
    this.showTable.set(!this.showTable());
  }

  exportStats(): void {
    const stats = this.stats();
    if (!stats) return;

    const csvData = [
      ['Catégorie', 'Clé', 'Compte'],
      ...Object.entries(stats.parImpact).map(([key, value]) => ['Impact', key, value]),
      ...Object.entries(stats.parPriorite).map(([key, value]) => ['Priorité', key, value]),
      ...Object.entries(stats.parSource).map(([key, value]) => ['Source', key, value]),
      ...Object.entries(stats.parStatut).map(([key, value]) => ['Statut', key, value]),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statistiques_demandes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}