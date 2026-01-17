import { Message } from './message.model';

export interface Chat {
  id: string;
  specialtyId: string;
  specialtyName: string;
  specialtyAvatar: string;
  messages: Message[];
  createdAt: Date;
  isOnline: boolean;
}
