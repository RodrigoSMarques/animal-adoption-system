import { Injectable } from '@angular/core';
import Parse from 'parse';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private ContactClass = Parse.Object.extend('Contact');

  constructor() {}

  async createContact(animalId: string, mensagem: string): Promise<Contact> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Get animal to fetch doador info
      const AnimalClass = Parse.Object.extend('Animal');
      const animalQuery = new Parse.Query(AnimalClass);
      animalQuery.include('doador');
      const animal = await animalQuery.get(animalId);

      const contactObject = new this.ContactClass();
      contactObject.set('animal', animal);
      contactObject.set('adotante', currentUser);
      contactObject.set('doador', animal.get('doador'));
      contactObject.set('mensagem', mensagem);

      await contactObject.save();

      return this.parseObjectToContact(contactObject);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao enviar mensagem');
    }
  }

  async getMyContacts(): Promise<Contact[]> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const query = new Parse.Query(this.ContactClass);
      query.equalTo('adotante', currentUser);
      query.include(['animal', 'doador']);
      query.descending('createdAt');

      const results = await query.find();
      return results.map(obj => this.parseObjectToContact(obj));
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar meus contatos');
    }
  }

  async getReceivedContacts(): Promise<Contact[]> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const query = new Parse.Query(this.ContactClass);
      query.equalTo('doador', currentUser);
      query.include(['animal', 'adotante']);
      query.descending('createdAt');

      const results = await query.find();
      return results.map(obj => this.parseObjectToContact(obj));
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao buscar contatos recebidos');
    }
  }

  private parseObjectToContact(obj: Parse.Object): Contact {
    const animal = obj.get('animal');
    const adotante = obj.get('adotante');
    const doador = obj.get('doador');

    return {
      objectId: obj.id,
      animal: {
        objectId: animal.id,
        nome: animal.get('nome')
      },
      adotante: {
        objectId: adotante.id,
        username: adotante.get('username'),
        telefone: adotante.get('telefone')
      },
      doador: {
        objectId: doador.id,
        username: doador.get('username'),
        telefone: doador.get('telefone')
      },
      mensagem: obj.get('mensagem'),
      createdAt: obj.get('createdAt'),
      updatedAt: obj.get('updatedAt')
    };
  }
}
