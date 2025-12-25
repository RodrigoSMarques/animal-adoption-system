import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import Parse from 'parse';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    // Initialize Parse
    Parse.initialize(environment.back4app.appId, environment.back4app.javascriptKey);
    Parse.serverURL = environment.back4app.serverURL;

    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async register(user: User): Promise<User> {
    try {
      const parseUser = new Parse.User();
      parseUser.set('username', user.username);
      parseUser.set('email', user.email);
      parseUser.set('password', user.password);
      parseUser.set('userType', user.userType);
      parseUser.set('telefone', user.telefone);
      parseUser.set('cidade', user.cidade);
      parseUser.set('estado', user.estado);

      await parseUser.signUp();

      const registeredUser: User = {
        objectId: parseUser.id,
        username: parseUser.get('username'),
        email: parseUser.get('email'),
        userType: parseUser.get('userType'),
        telefone: parseUser.get('telefone'),
        cidade: parseUser.get('cidade'),
        estado: parseUser.get('estado'),
        createdAt: parseUser.get('createdAt'),
        updatedAt: parseUser.get('updatedAt')
      };

      localStorage.setItem('currentUser', JSON.stringify(registeredUser));
      this.currentUserSubject.next(registeredUser);

      return registeredUser;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao registrar usuário');
    }
  }

  async login(username: string, password: string): Promise<User> {
    try {
      const parseUser = await Parse.User.logIn(username, password);

      const loggedUser: User = {
        objectId: parseUser.id,
        username: parseUser.get('username'),
        email: parseUser.get('email'),
        userType: parseUser.get('userType'),
        telefone: parseUser.get('telefone'),
        cidade: parseUser.get('cidade'),
        estado: parseUser.get('estado'),
        createdAt: parseUser.get('createdAt'),
        updatedAt: parseUser.get('updatedAt')
      };

      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      this.currentUserSubject.next(loggedUser);

      return loggedUser;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  async logout(): Promise<void> {
    try {
      await Parse.User.logOut();
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isDoador(): boolean {
    return this.currentUserValue?.userType === 'doador';
  }

  isAdotante(): boolean {
    return this.currentUserValue?.userType === 'adotante';
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      if (updates.telefone) currentUser.set('telefone', updates.telefone);
      if (updates.cidade) currentUser.set('cidade', updates.cidade);
      if (updates.estado) currentUser.set('estado', updates.estado);

      await currentUser.save();

      const updatedUser: User = {
        objectId: currentUser.id,
        username: currentUser.get('username'),
        email: currentUser.get('email'),
        userType: currentUser.get('userType'),
        telefone: currentUser.get('telefone'),
        cidade: currentUser.get('cidade'),
        estado: currentUser.get('estado'),
        createdAt: currentUser.get('createdAt'),
        updatedAt: currentUser.get('updatedAt')
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      currentUser.set('password', newPassword);
      await currentUser.save();
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao alterar senha');
    }
  }
}
