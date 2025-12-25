export interface User {
  objectId?: string;
  username: string;
  email: string;
  password?: string;
  userType: 'doador' | 'adotante';
  telefone: string;
  cidade: string;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}
