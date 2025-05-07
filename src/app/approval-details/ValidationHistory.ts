export interface ValidationHistory {
    id: number;
    demandeId: string;
    validatorName: string;
    validatorRole: string;
    validationDate: Date; // ou Date selon comment tu veux gérer le parsing
    approved: boolean;
}