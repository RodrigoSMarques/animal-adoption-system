export interface Animal {
  objectId?: string;
  nome: string;
  especie: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  sexo: 'macho' | 'femea';
  porte: 'pequeno' | 'medio' | 'grande';
  descricao: string;
  fotos: string[];
  localizacao: {
    latitude: number;
    longitude: number;
  };
  cidade: string;
  estado: string;
  status: 'disponivel' | 'adotado';
  doador?: {
    objectId: string;
    username: string;
    telefone: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnimalFilters {
  especie?: string;
  porte?: string;
  sexo?: string;
  idadeMin?: number;
  idadeMax?: number;
  cidade?: string;
  estado?: string;
  proximidade?: {
    latitude: number;
    longitude: number;
    raio: number;
  };
}
