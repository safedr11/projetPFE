import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationHistory } from './ValidationHistory'; // adapte le chemin
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-approval-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './approval-details.component.html',
  styleUrl: './approval-details.component.scss'
})
export class ApprovalDetailsComponent implements OnInit {
  displayedColumns: string[] = ['validatorName', 'validatorRole', 'validationDate', 'approved'];
  validationHistory: ValidationHistory[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { validationHistory: ValidationHistory[] }) {}

  ngOnInit(): void {
    this.validationHistory = this.data.validationHistory;
  }
}
