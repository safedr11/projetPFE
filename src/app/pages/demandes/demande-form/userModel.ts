export interface UserModel { 
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    profileImage?: string;
    roles: string[];
    active: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    password?: string;
  }
  