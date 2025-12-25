import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../../core/services/animal.service';
import { Animal, AnimalFilters } from '../../../core/models/animal.model';
import { AnimalCardComponent } from '../../../shared/components/animal-card/animal-card.component';
import { SearchFilterComponent } from '../../../shared/components/search-filter/search-filter.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, AnimalCardComponent, SearchFilterComponent, LoadingComponent],
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.css']
})
export class AnimalListComponent implements OnInit {
  animals: Animal[] = [];
  loading = false;
  errorMessage = '';
  currentFilters?: AnimalFilters;

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    this.loadAnimals();
  }

  async loadAnimals(filters?: AnimalFilters) {
    this.loading = true;
    this.errorMessage = '';
    this.currentFilters = filters;

    try {
      this.animals = await this.animalService.getAnimals(filters);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao carregar animais';
    } finally {
      this.loading = false;
    }
  }

  onFilterChange(filters: AnimalFilters) {
    this.loadAnimals(filters);
  }
}
