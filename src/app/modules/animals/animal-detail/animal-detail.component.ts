import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnimalService } from '../../../core/services/animal.service';
import { ContactService } from '../../../core/services/contact.service';
import { AuthService } from '../../../core/services/auth.service';
import { Animal } from '../../../core/models/animal.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent],
  templateUrl: './animal-detail.component.html',
  styleUrls: ['./animal-detail.component.css']
})
export class AnimalDetailComponent implements OnInit {
  animal?: Animal;
  loading = false;
  errorMessage = '';
  showContactForm = false;
  contactMessage = '';
  sendingMessage = false;
  messageSent = false;
  currentPhotoIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private animalService: AnimalService,
    private contactService: ContactService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnimal(id);
    }
  }

  async loadAnimal(id: string) {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.animal = await this.animalService.getAnimalById(id);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao carregar animal';
    } finally {
      this.loading = false;
    }
  }

  toggleContactForm() {
    this.showContactForm = !this.showContactForm;
    this.messageSent = false;
  }

  async sendContact() {
    if (!this.animal || !this.contactMessage.trim()) {
      return;
    }

    this.sendingMessage = true;

    try {
      await this.contactService.createContact(this.animal.objectId!, this.contactMessage);
      this.messageSent = true;
      this.contactMessage = '';
      setTimeout(() => {
        this.showContactForm = false;
        this.messageSent = false;
      }, 3000);
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar mensagem');
    } finally {
      this.sendingMessage = false;
    }
  }

  previousPhoto() {
    if (this.animal && this.animal.fotos.length > 0) {
      this.currentPhotoIndex = 
        (this.currentPhotoIndex - 1 + this.animal.fotos.length) % this.animal.fotos.length;
    }
  }

  nextPhoto() {
    if (this.animal && this.animal.fotos.length > 0) {
      this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.animal.fotos.length;
    }
  }

  get currentPhoto(): string {
    if (this.animal && this.animal.fotos.length > 0) {
      return this.animal.fotos[this.currentPhotoIndex];
    }
    return 'assets/images/no-image.svg';
  }

  get animalAge(): string {
    if (!this.animal) return '';
    if (this.animal.idade < 1) {
      return 'Menos de 1 ano';
    } else if (this.animal.idade === 1) {
      return '1 ano';
    } else {
      return `${this.animal.idade} anos`;
    }
  }
}
