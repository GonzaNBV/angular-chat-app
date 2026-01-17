import { Injectable, signal, computed } from '@angular/core';
import { Chat } from '../models/chat.model';
import { Message, MessageSender } from '../models/message.model';
import { Specialty } from '../models/specialty.model';

interface ConversationState {
  chatId: string;
  stage: 'greeting' | 'main-menu' | 'appointment-menu' | 'select-month' | 'select-day' | 'select-time' | 'describe-problem' | 'confirmation' | 'idle';
  selectedOption: string | null;
  appointmentData: {
    month?: string;
    day?: string;
    time?: string;
    problem?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chats = signal<Chat[]>([]);
  public chats$ = computed(() => this.chats());

  private conversationStates = new Map<string, ConversationState>();

  private botResponses: Record<string, string[]> = {
    cardiologia: ['¿Experimenta dolores en el pecho?', 'Le recomiendo monitorear su presión.', 'La salud cardíaca es prioritaria.'],
    traumatologia: ['¿Dónde está la lesión?', 'Es importante una evaluación física.', 'Evite movimientos bruscos.'],
    pediatria: ['¿Cuál es la edad del paciente?', 'Monitore los síntomas constantemente.', 'El bienestar infantil es crucial.'],
    psicologia: ['¿Cómo se siente emocionalmente?', 'El bienestar mental es fundamental.', 'Busquemos soluciones juntos.'],
    'clinica-medica': ['¿Cuánto tiempo tiene estos síntomas?', 'Mantenga un registro de síntomas.', 'La salud general requiere cuidados.'],
    neurologia: ['¿Experimenta dolores de cabeza?', 'La neurología requiere evaluación.', 'El sistema nervioso es complejo.'],
    oftalmologia: ['¿Cuándo fue su último examen visual?', 'La visión es importante cuidarla.', 'Los ojos son ventanas.'],
    odontologia: ['¿Cuándo fue su última limpieza dental?', 'La higiene bucal es esencial.', 'Smile es salud.'],
    otorrinolaringologia: ['¿Tiene problemas auditivos?', 'Le recomiendo una evaluación.', 'ORL es especialidad importante.']
  };

  private greetingResponses: Record<string, string> = {
    cardiologia: 'Bienvenido a Cardiología. Soy su asistente virtual especializado.',
    traumatologia: 'Bienvenido a Traumatología. Estoy aquí para asistirle.',
    pediatria: 'Bienvenido a Pediatría. Puedo ayudarle con la salud infantil.',
    psicologia: 'Bienvenido a Psicología. Estoy disponible para apoyarlo.',
    'clinica-medica': 'Bienvenido a Clínica Médica. ¿Cómo puedo ayudarle?',
    neurologia: 'Bienvenido a Neurología. Estoy aquí para asistirle.',
    oftalmologia: 'Bienvenido a Oftalmología. Puedo ayudarle con su salud visual.',
    odontologia: 'Bienvenido a Odontología. Estoy disponible para asistirle.',
    otorrinolaringologia: 'Bienvenido a ORL. Puedo ayudarle con sus consultas.'
  };

  private mainMenu = `¿Qué puedo hacer por usted?

<i class="bi bi-1-circle-fill"></i> Solicitar turno
<i class="bi bi-2-circle-fill"></i> Ver información
<i class="bi bi-3-circle-fill"></i> Emergencias`;

  private appointmentMenu = `Vamos a agendar su turno.

¿En qué mes desea agendar?
<i class="bi bi-1-circle-fill"></i> Enero
<i class="bi bi-2-circle-fill"></i> Febrero
<i class="bi bi-3-circle-fill"></i> Marzo
<i class="bi bi-0-circle-fill"></i> Cancelar`;

  private dayMenu = `Seleccione el día:

<i class="bi bi-1-circle-fill"></i> Semana 1 (1-7)
<i class="bi bi-2-circle-fill"></i> Semana 2 (8-14)
<i class="bi bi-3-circle-fill"></i> Semana 3 (15-21)
<i class="bi bi-4-circle-fill"></i> Semana 4 (22-28)
<i class="bi bi-0-circle-fill"></i> Cancelar`;

  private timeMenu = `Seleccione horario:

<i class="bi bi-1-circle-fill"></i> Mañana (9:00 - 12:00)
<i class="bi bi-2-circle-fill"></i> Tarde (14:00 - 17:00)
<i class="bi bi-3-circle-fill"></i> Noche (18:00 - 20:00)
<i class="bi bi-0-circle-fill"></i> Cancelar`;

  private monthMap: Record<string, string> = {
    '1': 'Enero',
    '2': 'Febrero',
    '3': 'Marzo'
  };

  private dayMap: Record<string, string> = {
    '1': 'Semana 1 (1-7)',
    '2': 'Semana 2 (8-14)',
    '3': 'Semana 3 (15-21)',
    '4': 'Semana 4 (22-28)'
  };

  private timeMap: Record<string, string> = {
    '1': 'Mañana (9:00 - 12:00)',
    '2': 'Tarde (14:00 - 17:00)',
    '3': 'Noche (18:00 - 20:00)'
  };

  createChat(specialty: Specialty): Chat {
    const chatId = `chat-${Date.now()}`;
    const chat: Chat = {
      id: chatId,
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      specialtyAvatar: specialty.avatar,
      messages: [],
      createdAt: new Date(),
      isOnline: true
    };

    this.chats.update(chats => [chat, ...chats]);

    this.conversationStates.set(chatId, {
      chatId,
      stage: 'greeting',
      selectedOption: null,
      appointmentData: {}
    });
    
    this.addGreetingMessage(chatId, specialty.id);
    return chat;
  }

  getChatById(id: string): Chat | undefined {
    return this.chats().find(chat => chat.id === id);
  }

  getChatBySpecialtyId(specialtyId: string): Chat | undefined {
    return this.chats().find(chat => chat.specialtyId === specialtyId);
  }

  deleteChat(id: string): void {
    this.chats.update(chats => chats.filter(chat => chat.id !== id));
    this.conversationStates.delete(id);
  }

  private addGreetingMessage(chatId: string, specialtyId: string): void {
    const greetingText = this.greetingResponses[specialtyId] || 'Bienvenido. ¿Cómo puedo ayudarle hoy?';
    const message: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      sender: 'bot',
      content: greetingText,
      timestamp: new Date()
    };

    this.addMessageToChat(chatId, message);

    // Enviar menú principal después del saludo
    setTimeout(() => {
      const menuMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId,
        sender: 'bot',
        content: this.mainMenu,
        timestamp: new Date()
      };
      this.addMessageToChat(chatId, menuMessage);
      
      // Actualizar estado a main-menu
      const state = this.conversationStates.get(chatId);
      if (state) {
        state.stage = 'main-menu';
      }
    }, 800);
  }

  sendMessage(chatId: string, content: string): void {
    const chat = this.getChatById(chatId);
    if (!chat || !content.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      sender: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    this.addMessageToChat(chatId, userMessage);

    // Respuesta automática del bot con retardo
    setTimeout(() => {
      const botResponse = this.generateBotResponse(chatId, chat.specialtyId, content);
      const botMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId,
        sender: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      this.addMessageToChat(chatId, botMessage);
    }, 500);
  }

  private generateBotResponse(chatId: string, specialtyId: string, userContent: string): string {
    const userLower = userContent.trim().toLowerCase();
    const state = this.conversationStates.get(chatId);

    if (!state) return 'Lo siento, hubo un error. Intente nuevamente.';

    const selectedOption = userLower.match(/^[0-5]$/)?.[0];

    // STAGE: main-menu
    if (state.stage === 'main-menu') {
      if (!selectedOption) {
        return 'Por favor, ingrese un número del 1 al 3.';
      }

      if (selectedOption === '1') {
        state.stage = 'appointment-menu';
        state.appointmentData = {};
        return this.appointmentMenu;
      } else if (selectedOption === '2') {
        state.stage = 'idle';
        return `Información sobre la especialidad:
- Horarios: Lunes a viernes 9:00 - 18:00
- Ubicación: Centro médico principal
- Profesionales: Especialistas altamente capacitados

Ingrese <i class="bi bi-0-circle-fill"></i> para volver al menú.`;
      } else if (selectedOption === '3') {
        state.stage = 'idle';
        return `⚠️ EMERGENCIA:
Si es una emergencia grave, llame al 911 inmediatamente.

Ingrese <i class="bi bi-0-circle-fill"></i> para volver al menú principal.`;
      } else {
        return 'Opción no válida. Ingrese 1, 2 o 3.';
      }
    }

    // Volver al menú desde estado idle
    if (state.stage === 'idle' && selectedOption === '0') {
      state.stage = 'main-menu';
      return this.mainMenu;
    }

    // STAGE: appointment-menu (seleccionar mes)
    if (state.stage === 'appointment-menu') {
      if (!selectedOption) {
        return 'Por favor, ingrese un número del 1 al 3 o 0 para cancelar.';
      }

      if (selectedOption === '0') {
        state.stage = 'main-menu';
        return `Turno cancelado.\n\n${this.mainMenu}`;
      }

      if (selectedOption === '1' || selectedOption === '2' || selectedOption === '3') {
        state.appointmentData.month = this.monthMap[selectedOption];
        state.stage = 'select-day';
        return this.dayMenu;
      } else {
        return 'Opción no válida. Ingrese 1, 2, 3 o 0 para cancelar.';
      }
    }

    // STAGE: select-day
    if (state.stage === 'select-day') {
      if (!selectedOption) {
        return 'Por favor, ingrese un número del 1 al 4 o 0 para cancelar.';
      }

      if (selectedOption === '0') {
        state.stage = 'main-menu';
        state.appointmentData = {};
        return `Turno cancelado.\n\n${this.mainMenu}`;
      }

      if (selectedOption === '1' || selectedOption === '2' || selectedOption === '3' || selectedOption === '4') {
        state.appointmentData.day = this.dayMap[selectedOption];
        state.stage = 'select-time';
        return this.timeMenu;
      } else {
        return 'Opción no válida. Ingrese 1, 2, 3, 4 o 0 para cancelar.';
      }
    }

    // STAGE: select-time
    if (state.stage === 'select-time') {
      if (!selectedOption) {
        return 'Por favor, ingrese un número del 1 al 3 o 0 para cancelar.';
      }

      if (selectedOption === '0') {
        state.stage = 'main-menu';
        state.appointmentData = {};
        return `Turno cancelado.\n\n${this.mainMenu}`;
      }

      if (selectedOption === '1' || selectedOption === '2' || selectedOption === '3') {
        state.appointmentData.time = this.timeMap[selectedOption];
        state.stage = 'describe-problem';
        return 'Por favor, describa brevemente el motivo de su consulta (máximo 500 caracteres):';
      } else {
        return 'Opción no válida. Ingrese 1, 2, 3 o 0 para cancelar.';
      }
    }

    // STAGE: describe-problem (ingreso de texto libre)
    if (state.stage === 'describe-problem') {
      if (!selectedOption) {
        state.appointmentData.problem = userContent.substring(0, 500);
        state.stage = 'confirmation';

        const confirmation = `CONFIRMACIÓN DE TURNO

📅 MES: ${state.appointmentData.month}
📆 SEMANA: ${state.appointmentData.day}
🕐 HORARIO: ${state.appointmentData.time}
📝 MOTIVO: ${state.appointmentData.problem}

¿CONFIRMA SU TURNO?
<i class="bi bi-0-circle-fill"></i> Sí, confirmar
<i class="bi bi-1-circle-fill"></i> No, cancelar`;
        return confirmation;
      } else {
        return 'Por favor, ingrese una descripción del motivo de su consulta.';
      }
    }

    // STAGE: confirmation
    if (state.stage === 'confirmation') {
      if (!selectedOption) {
        return 'Por favor, ingrese 0 para confirmar o 1 para cancelar.';
      }

      if (selectedOption === '0') {
        const finalConfirmation = `✅ TURNO CONFIRMADO

ESPECIALIDAD: ${this.getSpecialtyName(specialtyId)}
MES: ${state.appointmentData.month}
SEMANA: ${state.appointmentData.day}
HORARIO: ${state.appointmentData.time}
MOTIVO: ${state.appointmentData.problem}

SU TURNO HA SIDO RESERVADO.

Ingrese <i class="bi bi-0-circle-fill"></i> para volver al menú principal.`;
        state.stage = 'idle';
        state.appointmentData = {};
        return finalConfirmation;
      } else if (selectedOption === '1') {
        state.stage = 'main-menu';
        state.appointmentData = {};
        return `Turno cancelado.\n\n${this.mainMenu}`;
      } else {
        return 'Opción no válida. Ingrese 0 para confirmar o 1 para cancelar.';
      }
    }

    return 'No entiendo esa opción. Intente nuevamente.';
  }

  private getSpecialtyName(specialtyId: string): string {
    const nameMap: Record<string, string> = {
      cardiologia: 'Cardiología',
      traumatologia: 'Traumatología',
      pediatria: 'Pediatría',
      psicologia: 'Psicología',
      'clinica-medica': 'Clínica Médica',
      neurologia: 'Neurología',
      oftalmologia: 'Oftalmología',
      odontologia: 'Odontología',
      otorrinolaringologia: 'Otorrinolaringología'
    };
    return nameMap[specialtyId] || 'Especialidad';
  }

  private addMessageToChat(chatId: string, message: Message): void {
    this.chats.update(chats =>
      chats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  }

  getChatMessages(chatId: string): Message[] {
    return this.getChatById(chatId)?.messages ?? [];
  }
}
