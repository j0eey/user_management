export interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'locked';
    dob: string;
  }
  
  export type UserStatus = User['status'];