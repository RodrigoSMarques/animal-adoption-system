import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AnimalService } from '../../core/services/animal.service';
import { ContactService } from '../../core/services/contact.service';
import { User } from '../../core/models/user.model';
import { Animal } from '../../core/models/animal.model';
import { Contact } from '../../core/models/contact.model';
import { AnimalCardComponent } from '../../shared/components/animal-card/animal-card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AnimalCardComponent, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  myAnimals: Animal[] = [];
  myContacts: Contact[] = [];
  receivedContacts: Contact[] = [];
  loading = false;
  editMode = false;
  updatedUser: Partial<User> = {};

  constructor(
    public authService: AuthService,
    private animalService: AnimalService,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadUserData();
    }
  }

  async loadUserData() {
    this.loading = true;

    try {
      if (this.authService.isDoador()) {
        this.myAnimals = await this.animalService.getMyAnimals();
        this.receivedContacts = await this.contactService.getReceivedContacts();
      } else {
        this.myContacts = await this.contactService.getMyContacts();
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.loading = false;
    }
  }

  enableEditMode() {
    this.editMode = true;
    this.updatedUser = {
      telefone: this.currentUser?.telefone,
      cidade: this.currentUser?.cidade,
      estado: this.currentUser?.estado
    };
  }

  cancelEdit() {
    this.editMode = false;
    this.updatedUser = {};
  }

  async saveProfile() {
    try {
      await this.authService.updateProfile(this.updatedUser);
      this.currentUser = this.authService.currentUserValue;
      this.editMode = false;
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar perfil');
    }
  }

  async deleteAnimal(animalId: string) {
    if (confirm('Tem certeza que deseja deletar este animal?')) {
      try {
        await this.animalService.deleteAnimal(animalId);
        this.myAnimals = this.myAnimals.filter(a => a.objectId !== animalId);
        alert('Animal deletado com sucesso!');
      } catch (error: any) {
        alert(error.message || 'Erro ao deletar animal');
      }
    }
  }
}
