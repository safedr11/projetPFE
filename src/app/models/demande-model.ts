// demande.model.ts
export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
  }
  
  export interface RiskCategory {
    description: string;
    impactValue: number;
    probability: number;
    criticity?: number;
    rssiComments: string;
  }
  
  export interface RiskAssessment {
   
    rssiComments: string;
    disponibilite: RiskCategory;
    integrite: RiskCategory;
    confidentialite: RiskCategory;
  }
  
  export interface RequiredResources {
    humanResources: string;
    materialResources: string;
  }
  
  export interface TechnicalAction {
    id: number;
    actionNumber: number;
    description: string;
    responsable: string;
    plannedDate: Date;
    actualDate?: Date;
    status: TechnicalStatus;
    actionType: TechnicalActionType;
    comments: string;
  }
  
  export enum Categorie {
    Mineur = 'Mineur',
    Significatif = 'Significatif',
    Majeur_Applicatif = 'Majeur_Applicatif',
    Majeur_Non_Applicatif = 'Majeur_Non_Applicatif',
    Standard="Standard"
  }
  
  export enum Impact {
    Majeur = 'Majeur',
    Mineur = 'Mineur',
    Modéré = 'Modéré'
  }
  
  export enum Priorite {
    Immediate = 'Immediate',
    Haute = 'Haute',
    Moyenne = 'Moyenne',
    Basse = 'Basse'
  }
  
  export enum Source {
    Incident = 'Incident',
    Problème = 'Problème',
    Projet = 'Projet',
    Autres = 'Autres'
  }
  
  export enum Statuts {
    Brouillon = 'Brouillon',
    approuvée = 'approuvée',
    rejetée = 'rejetée',
    en_cours_revision = 'en_cours_revision',
    en_cours_execution = 'en_cours_execution',
    en_cours_validation = 'en_cours_validation'
  }
  
  export enum TechnicalActionType {
    DESCRIPTION = 'DESCRIPTION',
    TEST_PRE_PRODUCTION = 'TEST_PRE_PRODUCTION',
    RETOUR_ARRIERE = 'RETOUR_ARRIERE',
    VALIDATION_PLAN_RETOUR = 'VALIDATION_PLAN_RETOUR',
    TEST_POST_PRODUCTION = 'TEST_POST_PRODUCTION'
  }
  
  export enum TechnicalStatus {
    Non_entame = 'Non_entame',
    en_cours = 'en_cours',
    réalisé = 'réalisé',
    fermé = 'fermé'
  }
  
  export interface DemandeModel {
    id?: string;
    createdAt?: Date;
    demandeur: string;
    client: string;
    updatedAt?: Date;
    sourceDeChangement: Source;
    description: string;
    causesChangement: string;
    impactedInfrastructure: string;
    niveauImpact: Impact;
    priorite: Priorite;
    categorie: Categorie;
    status: Statuts;
    createdBy?: User;
    technicalActions: TechnicalAction[];
    riskAssessment: RiskAssessment;
    ressources: RequiredResources;
  }