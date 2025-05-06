import { Component, Inject, ViewEncapsulation, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../user.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatDialogModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  encapsulation: ViewEncapsulation.None
})
export class UserModalComponent {
  userForm: FormGroup;
  hidePassword = true;
  rolesList = ['ADMIN', 'DEMANDEUR', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTEUR'];

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserModel; isEdit: boolean; isNew?: boolean },
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.userForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullName: [this.data.user?.fullName || '', Validators.required],
      email: [this.data.user?.email || '', [Validators.required, Validators.email]],
      phone: [this.data.user?.phone || ''],
      profileImage: [this.data.user?.profileImage || ''],
      password: [
        this.data.user?.password || '',
        this.data.isNew ? [Validators.required, Validators.minLength(6)] : []
      ],
      confirmPassword: ['', this.data.isNew ? Validators.required : []],
      roles: [this.data.user?.roles || [], Validators.required],
      active: [this.data.user?.active ?? true],
      createdAt: [this.data.user?.createdAt || new Date()],
      updatedAt: [this.data.user?.updatedAt || new Date()]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  onSave(): void {
    if (this.userForm.invalid) return;

    const updatedUser: UserModel = {
      ...this.data.user,
      ...this.userForm.value,
      confirmPassword: undefined, // Ne pas inclure confirmPassword dans les données sauvegardées
    };

    // Afficher la fenêtre de confirmation
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        message: `Voulez-vous vraiment ${this.data.isNew ? 'créer' : 'enregistrer les modifications pour'} l'utilisateur ${updatedUser.fullName} ?`,
        confirmText: 'Oui',
        cancelText: 'Non'
      },
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // L'utilisateur a confirmé, fermer la fenêtre avec les données mises à jour
        this.dialogRef.close(updatedUser);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}