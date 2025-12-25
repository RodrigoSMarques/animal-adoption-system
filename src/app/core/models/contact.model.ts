export interface Contact {
  objectId?: string;
  animal: {
    objectId: string;
    nome: string;
  };
  adotante: {
    objectId: string;
    username: string;
    telefone: string;
  };
  doador: {
    objectId: string;
    username: string;
    telefone: string;
  };
  mensagem: string;
  createdAt?: Date;
  updatedAt?: Date;
}
