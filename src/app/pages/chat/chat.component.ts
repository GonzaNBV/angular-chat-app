import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { computed, signal } from '@angular/core';

import { ChatService } from '../../services/chat.service';
import { SpecialtyService } from '../../services/specialty.service';
import { InfoComponent } from '../../components/info/info.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfoComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  private chatId = signal<string | null>(null);
  chat = computed(() => {
    const id = this.chatId();
    return id ? this.chatService.getChatById(id) : null;
  });
  messages = computed(() => this.chat()?.messages ?? []);
  specialty = computed(() => {
    const c = this.chat();
    return c ? {
      id: c.specialtyId,
      name: c.specialtyName,
      avatar: c.specialtyAvatar,
      description: ''
    } : null;
  });

  messageForm!: FormGroup;
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private specialtyService: SpecialtyService,
    private formBuilder: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.messageForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const specialtyId = params['id'];

      if (!specialtyId) {
        this.router.navigate(['/especialidades']);
        return;
      }

      let chat = this.chatService.getChatBySpecialtyId(specialtyId);

      if (!chat) {
        const specialty = this.specialtyService.getSpecialtyById(specialtyId);
        if (!specialty) {
          this.router.navigate(['/especialidades']);
          return;
        }
        chat = this.chatService.createChat(specialty);
      }

      this.chatId.set(chat.id);
      this.shouldScroll = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    if (!this.messageForm.valid) return;

    const content = this.messageForm.get('message')?.value?.trim();
    const id = this.chatId();

    if (!content || !id) return;

    this.chatService.sendMessage(id, content);
    this.messageForm.reset();
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    if (!this.messagesContainer) return;
    this.messagesContainer.nativeElement.scrollTop =
      this.messagesContainer.nativeElement.scrollHeight;
  }
}
