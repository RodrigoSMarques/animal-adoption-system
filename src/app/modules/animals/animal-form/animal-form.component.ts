import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AnimalService } from '../../../core/services/animal.service';
import { LocationService } from '../../../core/services/location.service';
import { Animal } from '../../../core/models/animal.model';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.css']
})
export class AnimalFormComponent {
  animalForm: FormGroup;
  loading = false;
  errorMessage = '';
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  useCurrentLocation = false;

  constructor(
    private formBuilder: FormBuilder,
    private animalService: AnimalService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.animalForm = this.formBuilder.group({
      nome: ['', Validators.required],
      especie: ['cachorro', Validators.required],
      raca: ['', Validators.required],
      idade: [0, [Validators.required, Validators.min(0)]],
      sexo: ['macho', Validators.required],
      porte: ['medio', Validators.required],
      descricao: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required]
    });
  }

  get f() {
    return this.animalForm.controls;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  getCurrentLocation() {
    this.locationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.animalForm.patchValue({
          latitude: position.latitude,
          longitude: position.longitude
        });
        this.useCurrentLocation = true;
        alert('Localização obtida com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Não foi possível obter sua localização. Por favor, insira manualmente.');
      }
    });
  }

  async onSubmit() {
    if (this.animalForm.invalid) {
      Object.keys(this.animalForm.controls).forEach(key => {
        this.animalForm.controls[key].markAsTouched();
      });
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('Por favor, selecione pelo menos uma foto do animal.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const formValue = this.animalForm.value;
      const animal: Animal = {
        nome: formValue.nome,
        especie: formValue.especie,
        raca: formValue.raca,
        idade: formValue.idade,
        sexo: formValue.sexo,
        porte: formValue.porte,
        descricao: formValue.descricao,
        cidade: formValue.cidade,
        estado: formValue.estado,
        localizacao: {
          latitude: formValue.latitude,
          longitude: formValue.longitude
        },
        fotos: [],
        status: 'disponivel'
      };

      await this.animalService.createAnimal(animal, this.selectedFiles);
      alert('Animal cadastrado com sucesso!');
      this.router.navigate(['/perfil']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao cadastrar animal';
    } finally {
      this.loading = false;
    }
  }
}
