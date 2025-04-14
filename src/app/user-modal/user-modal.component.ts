import { Component, Inject, ViewEncapsulation ,LOCALE_ID} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  ],encapsulation: ViewEncapsulation.None
  
})
export class UserModalComponent {
  userForm: FormGroup;
  hidePassword = true;
  rolesList = ['ADMIN', 'DEMANDEUR', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTEUR'];

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserModel, isEdit: boolean, isNew?: boolean },
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
      roles: [this.data.user?.roles || [], Validators.required],
      active: [this.data.user?.active ?? true],
      createdAt: [this.data.user?.createdAt || new Date()],
      updatedAt: [this.data.user?.updatedAt || new Date()]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.getRawValue();
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  formatRoleForDisplay(role: string): string {
    return role.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }
}