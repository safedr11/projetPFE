import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html', // Reference the template file
  styleUrls: ['./confirmation-dialog.component.scss'], // Optional: Add styles if needed
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; confirmText: string; cancelText: string }
  ) {}
}