import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Animal } from '../../../core/models/animal.model';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './animal-card.component.html',
  styleUrls: ['./animal-card.component.css']
})
export class AnimalCardComponent {
  @Input() animal!: Animal;

  get mainPhoto(): string {
    return this.animal.fotos && this.animal.fotos.length > 0 
      ? this.animal.fotos[0] 
      : 'assets/images/no-image.png';
  }

  get animalAge(): string {
    if (this.animal.idade < 1) {
      return 'Menos de 1 ano';
    } else if (this.animal.idade === 1) {
      return '1 ano';
    } else {
      return `${this.animal.idade} anos`;
    }
  }
}
