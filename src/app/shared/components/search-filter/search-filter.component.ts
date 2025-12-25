import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalFilters } from '../../../core/models/animal.model';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent {
  @Output() filterChange = new EventEmitter<AnimalFilters>();

  filters: AnimalFilters = {};
  showFilters = false;
  useLocation = false;
  raio = 50;

  constructor(private locationService: LocationService) {}

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    if (this.useLocation) {
      this.locationService.getCurrentPosition().subscribe({
        next: (position) => {
          this.filters.proximidade = {
            latitude: position.latitude,
            longitude: position.longitude,
            raio: this.raio
          };
          this.filterChange.emit(this.filters);
        },
        error: (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização. Removendo filtro de proximidade.');
          this.filters.proximidade = undefined;
          this.filterChange.emit(this.filters);
        }
      });
    } else {
      this.filters.proximidade = undefined;
      this.filterChange.emit(this.filters);
    }
  }

  clearFilters() {
    this.filters = {};
    this.useLocation = false;
    this.raio = 50;
    this.filterChange.emit(this.filters);
  }
}
