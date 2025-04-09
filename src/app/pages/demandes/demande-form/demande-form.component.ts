import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DemandesService } from '../../../services/demandes.service';
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
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: true,
  selector: 'app-demande-form',
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DragDropModule,
    FormsModule,
    MatIconModule
  ],
})
export class DemandeFormComponent implements OnInit {
  @Input() initialData?: DemandeModel;
  @Output() submitForm = new EventEmitter<DemandeModel>();

  form!: FormGroup;
  newActionForm!: FormGroup;

  enums = {
    categories: Object.values(Categorie),
    impacts: Object.values(Impact),
    priorities: Object.values(Priorite),
    sources: Object.values(Source),
    statuses: Object.values(Statuts),
    actionTypes: Object.values(TechnicalActionType),
    actionStatuses: Object.values(TechnicalStatus)
  };

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private demandeService: DemandesService,) {}

  ngOnInit(): void {
    this.initForm();
    this.initNewActionForm();
  }

  private initForm(): void {
    const defaultRiskAssessment: RiskAssessment = {

      rssiComments: '',
      disponibilite: { description: '', impactValue: 1, probability: 1 },
      integrite: { description: '', impactValue: 1, probability: 1 },
      confidentialite: { description: '', impactValue: 1, probability: 1 }
    };

    const defaultRessources: RequiredResources = {
      humanResources: '',
      materialResources: ''
    };

    this.form = this.fb.group({
      
      demandeur: [this.initialData?.demandeur || '', Validators.required],
      client: [this.initialData?.client || '', Validators.required],
      sourceDeChangement: [this.initialData?.sourceDeChangement || Source.Projet, Validators.required],
      description: [this.initialData?.description || '', Validators.required],
      /*causesChangement: [this.initialData?.causesChangement || '', Validators.required],*/
      impactedInfrastructure: [this.initialData?.impactedInfrastructure || '', Validators.required],
      niveauImpact: [this.initialData?.niveauImpact || Impact.Mineur, Validators.required],
      priorite: [this.initialData?.priorite || Priorite.Moyenne, Validators.required],
      categorie: [this.initialData?.categorie || Categorie.Mineur, Validators.required],
      status: [this.initialData?.status || Statuts.Brouillon, Validators.required],
      ressources: this.fb.group({
        humanResources: [this.initialData?.ressources?.humanResources || ''],
        materialResources: [this.initialData?.ressources?.materialResources || '']
      }),
      riskAssessment: this.fb.group({
       
        disponibilite: this.fb.group({
          description: [this.initialData?.riskAssessment?.disponibilite?.description || ''],
          impactValue: [this.initialData?.riskAssessment?.disponibilite?.impactValue || 1],
          probability: [this.initialData?.riskAssessment?.disponibilite?.probability || 1],
          rssiComments: [this.initialData?.riskAssessment?.rssiComments || '']
        }),
        integrite: this.fb.group({
          description: [this.initialData?.riskAssessment?.integrite?.description || ''],
          impactValue: [this.initialData?.riskAssessment?.integrite?.impactValue || 1],
          probability: [this.initialData?.riskAssessment?.integrite?.probability || 1],
          rssiComments: [this.initialData?.riskAssessment?.rssiComments || '']
        }),
        confidentialite: this.fb.group({
          description: [this.initialData?.riskAssessment?.confidentialite?.description || ''],
          impactValue: [this.initialData?.riskAssessment?.confidentialite?.impactValue || 1],
          probability: [this.initialData?.riskAssessment?.confidentialite?.probability || 1],
          rssiComments: [this.initialData?.riskAssessment?.rssiComments || ''],
        })
      }),
      technicalActions: this.fb.array([])
    });

    if (this.initialData?.technicalActions) {
      this.initialData.technicalActions.forEach(action => {
        this.addTechnicalAction(action);
      });
    }
  }

  private initNewActionForm(): void {
    this.newActionForm = this.fb.group({
      description: ['', Validators.required],
      responsable: ['', Validators.required],
      plannedDate: ['', Validators.required],
      actionType: [TechnicalActionType.DESCRIPTION]
    });
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
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  addNewAction(): void {
    if (this.newActionForm.invalid) return;

    const formValue = this.newActionForm.value;
    const newAction: TechnicalAction = {
      id: this.technicalActions.length + 1,
      actionNumber: this.technicalActions.length + 1,
      description: formValue.description,
      responsable: formValue.responsable,
      plannedDate: new Date(formValue.plannedDate),
      status: TechnicalStatus.Non_entame,
      actionType: formValue.actionType,
      comments: ''
    };

    this.addTechnicalAction(newAction);
    this.newActionForm.reset({
      actionType: TechnicalActionType.DESCRIPTION
    });
  }

  removeTechnicalAction(index: number): void {
    this.technicalActions.removeAt(index);
    this.updateActionNumbers();
  }

  calculateCriticity(riskType: 'disponibilite' | 'integrite' | 'confidentialite'): number {
    const riskGroup = this.form.get(`riskAssessment.${riskType}`);
    if (!riskGroup) return 0;
    
    const impactValue = riskGroup.get('impactValue')?.value || 0;
    const probability = riskGroup.get('probability')?.value || 0;
    return impactValue * probability;
  }

  drop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.technicalActions.controls, event.previousIndex, event.currentIndex);
    this.updateActionNumbers();
    this.technicalActions.updateValueAndValidity();
  }

  private updateActionNumbers(): void {
    this.technicalActions.controls.forEach((control, index) => {
      control.patchValue({ 
        actionNumber: index + 1,
        id: index + 1 
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
  
      // Préparation des données pour l'API
      const demandePayload: DemandeModel = {
        causesChangement: formValue.causesChangement || '',
        demandeur: formValue.demandeur,
        client: formValue.client,
        sourceDeChangement: formValue.sourceDeChangement,
        description: formValue.description,
        impactedInfrastructure: formValue.impactedInfrastructure,
        niveauImpact: formValue.niveauImpact,
        priorite: formValue.priorite,
        categorie: formValue.categorie,
        status: formValue.status,
        technicalActions: formValue.technicalActions.map((action: any) => ({
          description: action.description,
          responsable: action.responsable,
          plannedDate: new Date(action.plannedDate).toISOString(),
          status: action.status,
          actionType: action.actionType,
          comments: action.comments
        })),
        riskAssessment: {
          rssiComments: formValue.riskAssessment.rssiComments,
          disponibilite: formValue.riskAssessment.disponibilite,
          integrite: formValue.riskAssessment.integrite,
          confidentialite: formValue.riskAssessment.confidentialite
        },
        ressources: {
          humanResources: formValue.ressources.humanResources,
          materialResources: formValue.ressources.materialResources
        }
      };
  
      // Appel du service pour soumettre la demande
      this.demandeService.submitDemande(demandePayload).subscribe({
        next: (response) => {
          this.snackBar.open('Demande créée avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/home/demandes']);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.snackBar.open(
            error.error?.message || 'Erreur lors de la création de la demande',
            'Fermer',
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      });
    } else {
      this.markAllFormControlsAsTouched(this.form);
      this.snackBar.open('Veuillez corriger les erreurs du formulaire', 'Fermer', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
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
