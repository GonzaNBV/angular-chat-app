import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { computed, signal } from '@angular/core';
import { filter } from 'rxjs/operators';

import { SpecialtyService } from '../../services/specialty.service';
import { ChatService } from '../../services/chat.service';
import { InfoComponent } from '../../components/info/info.component';
import { Specialty } from '../../models/specialty.model';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InfoComponent
  ],
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent implements OnInit {
  specialties = signal<Specialty[]>([]);
  private currentChatId = signal<string | null>(null);
  isSpecialtyActive = computed(() => this.currentChatId() !== null);
  currentSpecialty = computed(() => {
    const chatId = this.currentChatId();
    if (!chatId) return null;
    return this.chatService.getChatById(chatId);
  });

  constructor(
    private specialtyService: SpecialtyService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.specialties.set(this.specialtyService.specialties());
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.route.firstChild;
        if (childRoute?.params) {
          childRoute.params.subscribe(params => {
            const specialtyId = params['id'];
            if (specialtyId) {
              let chat = this.chatService.getChatBySpecialtyId(specialtyId);
              if (!chat) {
                const specialty = this.specialtyService.getSpecialtyById(specialtyId);
                if (specialty) {
                  chat = this.chatService.createChat(specialty);
                }
              }
              if (chat) {
                this.currentChatId.set(chat.id);
              }
            } else {
              this.currentChatId.set(null);
            }
          });
        } else {
          this.currentChatId.set(null);
        }
      });
  }

  private findChatBySpecialty(specialtyId: string) {
    return null;
  }
}

