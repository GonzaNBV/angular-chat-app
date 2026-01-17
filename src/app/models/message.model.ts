export type MessageSender = 'user' | 'bot';

export interface Message {
  id: string;
  chatId: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
}