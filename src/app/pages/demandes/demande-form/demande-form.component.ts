import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DemandesService } from '../../../services/demandes.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FrenchDatePipe } from '../french-date.pipe';
import { 
  DemandeModel, 
  Categorie, 
  Impact, 
  Priorite, 
  Source, 
  Statuts, 
  TechnicalActionType, 
  TechnicalStatus, 
  TechnicalAction,
  RiskAssessment,
  RequiredResources
} from '../../../models/demande-model';

@Component({
  selector: 'app-demande-form',
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss'],
  standalone: true,
  imports: [ 
    MatIconModule,
    MatButtonModule, 
    MatInputModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    MatStepperModule, 
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule,
    FrenchDatePipe
  ]
})
export class DemandeFormComponent implements OnInit {
  @Input() initialData?: DemandeModel;
  @Output() submitForm = new EventEmitter<DemandeModel>();

  form!: FormGroup;
  enums = {
    categories: Object.values(Categorie),
    impacts: Object.values(Impact),
    priorities: Object.values(Priorite),
    sources: Object.values(Source),
    statuses: Object.values(Statuts),
    actionTypes: Object.values(TechnicalActionType),
    actionStatuses: Object.values(TechnicalStatus)
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private demandeService: DemandesService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      basicInfo: this.fb.group({
        demandeur: [this.initialData?.demandeur || '', Validators.required],
        client: [this.initialData?.client || '', Validators.required],
        sourceDeChangement: [this.initialData?.sourceDeChangement || Source.Projet, Validators.required],
        description: [this.initialData?.description || '', Validators.required],
      }),
      study: this.fb.group({
        impactedInfrastructure: [this.initialData?.impactedInfrastructure || '', Validators.required],
        niveauImpact: [this.initialData?.niveauImpact || Impact.Mineur, Validators.required],
        priorite: [this.initialData?.priorite || Priorite.Moyenne, Validators.required],
        categorie: [this.initialData?.categorie || Categorie.Mineur, Validators.required],
        status: [this.initialData?.status || Statuts.Brouillon, Validators.required],
      }),
      ressources: this.fb.group({
        humanResources: [this.initialData?.ressources?.humanResources || ''],
        materialResources: [this.initialData?.ressources?.materialResources || '']
      }),
      riskAssessment: this.fb.group({
        disponibilite: this.createRiskGroup(this.initialData?.riskAssessment?.disponibilite),
        integrite: this.createRiskGroup(this.initialData?.riskAssessment?.integrite),
        confidentialite: this.createRiskGroup(this.initialData?.riskAssessment?.confidentialite)
      }),
      technicalActions: this.fb.array([])
    });

    if (this.initialData?.technicalActions) {
      this.initialData.technicalActions.forEach(action => this.addTechnicalAction(action));
    }
  }

  private createRiskGroup(riskData?: any): FormGroup {
    return this.fb.group({
      description: [riskData?.description || ''],
      impactValue: [riskData?.impactValue || 1],
      probability: [riskData?.probability || 1],
      rssiComments: [riskData?.rssiComments || '']
    });
  }

  get basicInfo(): FormGroup {
    return this.form.get('basicInfo') as FormGroup;
  }
  
  get study(): FormGroup {
    return this.form.get('study') as FormGroup;
  }
  
  get ressources(): FormGroup {
    return this.form.get('ressources') as FormGroup;
  }
  
  get riskAssessment(): FormGroup {
    return this.form.get('riskAssessment') as FormGroup;
  }
  
  get technicalActions(): FormArray {
    return this.form.get('technicalActions') as FormArray;
  }

  addTechnicalAction(action?: TechnicalAction): void {
    const actionGroup = this.fb.group({
      id: [action?.id || this.technicalActions.length + 1],
      actionNumber: [action?.actionNumber || this.technicalActions.length + 1],
      description: [action?.description || '', Validators.required],
      responsable: [action?.responsable || '', Validators.required],
      plannedDate: [action?.plannedDate ? this.formatDateForInput(action.plannedDate) : '', Validators.required],
      status: [action?.status || TechnicalStatus.Non_entame],
      actionType: [action?.actionType || TechnicalActionType.DESCRIPTION],
      comments: [action?.comments || '']
    });

    this.technicalActions.push(actionGroup);
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  removeTechnicalAction(index: number): void {
    this.technicalActions.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const demandePayload: DemandeModel = {
        ...formValue.basicInfo,
        ...formValue.study,
        ressources: formValue.ressources,
        riskAssessment: formValue.riskAssessment,
        technicalActions: formValue.technicalActions.map((action: any) => ({
          ...action,
          plannedDate: action.plannedDate ? new Date(action.plannedDate) : null
        }))
      };

      this.demandeService.submitDemande(demandePayload).subscribe({
        next: () => {
          this.snackBar.open('Demande créée avec succès', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          this.router.navigate(['/home/demandes']);
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Erreur lors de la création', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    } else {
      this.markAllFormControlsAsTouched(this.form);
      this.snackBar.open('Veuillez corriger les erreurs du formulaire', 'Fermer', { duration: 5000, panelClass: ['warning-snackbar'] });
    }
  }

  private markAllFormControlsAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllFormControlsAsTouched(control);
      }
    });
  }
}