// Tipos internos do frontend — adaptados aos IDs numéricos do backend

export interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface Conversation {
  id: number;
  title: string;
  preview: string;
  updatedAt: Date;
  messages: Message[];
}
