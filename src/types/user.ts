export interface User {
  id: string;
  firstName: string;
  lastName?: string; 
  email: string;
  status: 'ACTIVE' | 'LOCKED';
  dateOfBirth: string; 
}