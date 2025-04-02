// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true, // Composant standalone
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: any;
  isEditing = false;
  isUploading = false;
  

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private dialog: MatDialog,
     private snackBar: MatSnackBar,
  ) {
    // Initialisation du formulaire réactif
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileImage: [''],
      phone: ['', Validators.required], // Ajout de Validators.required pour le numéro de téléphone
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        console.log('Données du profil reçues :', profile);
        this.userProfile = profile;
        this.profileForm.patchValue(profile); // Remplir le formulaire avec les données du profil
      },
      error: (err) => console.error('Erreur lors du chargement du profil :', err)
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.userProfile); // Réinitialiser le formulaire si l'édition est annulée
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updateData = {
        fullName: this.profileForm.value.fullName,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        profileImage: this.profileForm.value.profileImage
      };

      this.profileService.updateProfile(updateData).subscribe({
        next: () => {
          console.log('Profil mis à jour avec succès');
          this.snackBar.open('Profil mis à jour avec succès.', 'Fermer', { duration: 3000 });

          // Rechargez les données du profil depuis le backend
          this.loadProfile();

          // Désactivez le mode édition
          this.isEditing = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du profil :', err);
          this.snackBar.open('Erreur lors de la mise à jour du profil.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  async uploadImage(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    this.isUploading = true; // Active l'indicateur de chargement

    return new Promise((resolve) => {
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5MB max
          this.snackBar.open('La taille maximale est de 5MB', 'OK', { duration: 3000 });
          this.isUploading = false; // Désactive l'indicateur de chargement
          return resolve();
        }

        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.profileForm.patchValue({
              profileImage: e.target.result
            });
            this.isUploading = false; // Désactive l'indicateur de chargement
            resolve();
          };
          reader.readAsDataURL(file);
        } else {
          this.isUploading = false; // Désactive l'indicateur si aucun fichier n'est sélectionné
        }
      };
      input.click();
    });
  }
}