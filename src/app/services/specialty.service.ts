import { Injectable, signal } from '@angular/core';
import { Specialty } from '../models/specialty.model';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  specialties = signal<Specialty[]>([
    { id: 'cardiologia', name: 'Cardiología', avatar: 'avatar/cardiologia.png', description: 'Enfermedades del corazón' },
    { id: 'traumatologia', name: 'Traumatología', avatar: 'avatar/traumatologia.png', description: 'Lesiones y fracturas' },
    { id: 'pediatria', name: 'Pediatría', avatar: 'avatar/pediatria.png', description: 'Medicina infantil' },
    { id: 'psicologia', name: 'Psicología', avatar: 'avatar/psicologia.png', description: 'Salud mental' },
    { id: 'clinica-medica', name: 'Clínica Médica', avatar: 'avatar/clinica-medica.png', description: 'Medicina general' },
    { id: 'neurologia', name: 'Neurología', avatar: 'avatar/neurologia.png', description: 'Sistema nervioso' },
    { id: 'oftalmologia', name: 'Oftalmología', avatar: 'avatar/oftalmologia.png', description: 'Enfermedades oculares' },
    { id: 'odontologia', name: 'Odontología', avatar: 'avatar/odontologia.png', description: 'Salud bucal' },
    { id: 'otorrinolaringologia', name: 'Otorrinolaringología', avatar: 'avatar/otorrinolaringologia.png', description: 'ORL' }
  ]);

  getSpecialtyById(id: string): Specialty | undefined {
    return this.specialties().find(s => s.id === id);
  }
}