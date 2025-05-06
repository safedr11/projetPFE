import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { UserModel } from '../user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog'; // Add MatDialogModule
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  standalone: true,
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss'],
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule, // Add this to the imports
    ConfirmationDialogComponent,
  ],
})
export class UtilisateursComponent implements OnInit {
  users: UserModel[] = [];
  roles: string[] = ['ROLE_ADMIN', 'ROLE_DEMANDEUR', 'ROLE_ChangeManager', 'ROLE_RSSI', 'ROLE_DBU', 'ROLE_DSI', 'ROLE_EXECUTEUR'];
  selectedRole: string = '';
  selectedStatus: boolean | null = null;
  displayedColumns: string[] = ['id', 'fullName', 'email', 'roles', 'createdAt', 'updatedAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<UserModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;
    });
  }

  applyFilters(): void {
    this.dataSource.data = this.users.filter(user => {
      const matchesStatus = this.selectedStatus === null || user.active === this.selectedStatus;
      const matchesRole = !this.selectedRole || user.roles.includes(this.selectedRole);
      return matchesStatus && matchesRole;
    });
  }

  resetFilters(): void {
    this.selectedRole = '';
    this.selectedStatus = null;
    this.dataSource.data = this.users;
  }

  toggleStatus(user: UserModel): void {
    const action = user.active ? 'désactiver' : 'activer';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = {
      message: `Voulez-vous vraiment ${action} l'utilisateur ${user.fullName} ?`,
      confirmText: 'Oui',
      cancelText: 'Non'
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.toggleUserStatus(user.id).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.dataSource.data = [...this.users];
              this.snackBar.open(
                `Utilisateur ${updatedUser.active ? 'activé' : 'désactivé'} avec succès`,
                'Fermer',
                { duration: 3000 }
              );
            }
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du statut', err);
            this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  viewProfile(user: UserModel): void {
    this.dialog.open(UserModalComponent, {
      width: '500px',
      data: { user, isEdit: false }
    });
  }

  editUser(user: UserModel): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '600px',
      data: { user, isEdit: true }
    });
  
    dialogRef.afterClosed().subscribe(updatedData => {
      if (updatedData) {
        this.userService.updateUser(user.id, updatedData).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.dataSource.data = [...this.users];
              this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', {
                duration: 3000
              });
            }
          },
          error: (err) => console.error('Erreur lors de la mise à jour', err)
        });
      }
    });
  }
  addUser(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '600px',
      data: {
        user: {
          id: null,
          fullName: '',
          email: '',
          phone: '',
          profileImage: '',
          password: '',
          roles: [],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        isEdit: false,
        isNew: true
      }
    });

    dialogRef.afterClosed().subscribe(newUserData => {
      if (newUserData) {
        this.userService.createUser(newUserData).subscribe({
          next: (createdUser) => {
            console.log('Utilisateur créé avec succès', createdUser);
            this.users.push(createdUser);
            this.dataSource.data = [...this.users];
            this.snackBar.open('Utilisateur créé avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Erreur lors de la création', err);
            this.snackBar.open(err.error || 'Erreur lors de la création de l\'utilisateur', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}