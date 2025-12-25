import { Injectable } from '@angular/core';
import Parse from 'parse';
import { Animal, AnimalFilters } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private AnimalClass = Parse.Object.extend('Animal');

  constructor() {}

  async createAnimal(animal: Animal, photoFiles: File[]): Promise<Animal> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const animalObject = new this.AnimalClass();
      
      // Upload photos
      const photoUrls: string[] = [];
      for (const file of photoFiles) {
        const parseFile = new Parse.File(file.name, file);
        await parseFile.save();
        photoUrls.push(parseFile.url() || '');
      }

      // Set animal properties
      animalObject.set('nome', animal.nome);
      animalObject.set('especie', animal.especie);
      animalObject.set('raca', animal.raca);
      animalObject.set('idade', animal.idade);
      animalObject.set('sexo', animal.sexo);
      animalObject.set('porte', animal.porte);
      animalObject.set('descricao', animal.descricao);
      animalObject.set('fotos', photoUrls);
      animalObject.set('cidade', animal.cidade);
      animalObject.set('estado', animal.estado);
      animalObject.set('status', 'disponivel');
      animalObject.set('doador', currentUser);

      // Set geolocation
      const geoPoint = new Parse.GeoPoint(
        animal.localizacao.latitude,
        animal.localizacao.longitude
      );
      animalObject.set('localizacao', geoPoint);

      await animalObject.save();

      return this.parseObjectToAnimal(animalObject);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao cadastrar animal');
    }
  }

  async getAnimals(filters?: AnimalFilters, limit: number = 20, skip: number = 0): Promise<Animal[]> {
    try {
      const query = new Parse.Query(this.AnimalClass);
      
      query.equalTo('status', 'disponivel');
      query.include('doador');
      query.descending('createdAt');
      query.limit(limit);
      query.skip(skip);

      // Apply filters
      if (filters) {
        if (filters.especie) {
          query.equalTo('especie', filters.especie);
        }
        if (filters.porte) {
          query.equalTo('porte', filters.porte);
        }
        if (filters.sexo) {
          query.equalTo('sexo', filters.sexo);
        }
        if (filters.cidade) {
          query.equalTo('cidade', filters.cidade);
        }
        if (filters.estado) {
          query.equalTo('estado', filters.estado);
        }
        if (filters.idadeMin !== undefined) {
          query.greaterThanOrEqualTo('idade', filters.idadeMin);
        }
        if (filters.idadeMax !== undefined) {
          query.lessThanOrEqualTo('idade', filters.idadeMax);
        }
        if (filters.proximidade) {
          const geoPoint = new Parse.GeoPoint(
            filters.proximidade.latitude,
            filters.proximidade.longitude
          );
          query.withinKilometers('localizacao', geoPoint, filters.proximidade.raio);
        }
      }

      const results = await query.find();
      return results.map(obj => this.parseObjectToAnimal(obj));
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar animais');
    }
  }

  async getAnimalById(id: string): Promise<Animal> {
    try {
      const query = new Parse.Query(this.AnimalClass);
      query.include('doador');
      const animalObject = await query.get(id);
      return this.parseObjectToAnimal(animalObject);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar animal');
    }
  }

  async getMyAnimals(): Promise<Animal[]> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const query = new Parse.Query(this.AnimalClass);
      query.equalTo('doador', currentUser);
      query.descending('createdAt');

      const results = await query.find();
      return results.map(obj => this.parseObjectToAnimal(obj));
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar meus animais');
    }
  }

  async updateAnimal(id: string, updates: Partial<Animal>): Promise<Animal> {
    try {
      const query = new Parse.Query(this.AnimalClass);
      const animalObject = await query.get(id);

      if (updates.nome) animalObject.set('nome', updates.nome);
      if (updates.especie) animalObject.set('especie', updates.especie);
      if (updates.raca) animalObject.set('raca', updates.raca);
      if (updates.idade !== undefined) animalObject.set('idade', updates.idade);
      if (updates.sexo) animalObject.set('sexo', updates.sexo);
      if (updates.porte) animalObject.set('porte', updates.porte);
      if (updates.descricao) animalObject.set('descricao', updates.descricao);
      if (updates.cidade) animalObject.set('cidade', updates.cidade);
      if (updates.estado) animalObject.set('estado', updates.estado);
      if (updates.status) animalObject.set('status', updates.status);

      await animalObject.save();
      return this.parseObjectToAnimal(animalObject);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar animal');
    }
  }

  async deleteAnimal(id: string): Promise<void> {
    try {
      const query = new Parse.Query(this.AnimalClass);
      const animalObject = await query.get(id);
      await animalObject.destroy();
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao deletar animal');
    }
  }

  private parseObjectToAnimal(obj: Parse.Object): Animal {
    const doador = obj.get('doador');
    const localizacao = obj.get('localizacao');

    return {
      objectId: obj.id,
      nome: obj.get('nome'),
      especie: obj.get('especie'),
      raca: obj.get('raca'),
      idade: obj.get('idade'),
      sexo: obj.get('sexo'),
      porte: obj.get('porte'),
      descricao: obj.get('descricao'),
      fotos: obj.get('fotos') || [],
      cidade: obj.get('cidade'),
      estado: obj.get('estado'),
      status: obj.get('status'),
      localizacao: localizacao ? {
        latitude: localizacao.latitude,
        longitude: localizacao.longitude
      } : { latitude: 0, longitude: 0 },
      doador: doador ? {
        objectId: doador.id,
        username: doador.get('username'),
        telefone: doador.get('telefone')
      } : undefined,
      createdAt: obj.get('createdAt'),
      updatedAt: obj.get('updatedAt')
    };
  }
}
