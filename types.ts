
export enum MessageRole {
  USER = 'user',
  LEONUX = 'model',
}

export enum ModelType {
  CHAT = 'gpt-4o-mini',
  IMAGE = 'dall-e-3',
  VIDEO = 'none'
}

export interface MessagePart {
  text?: string;
  image?: string; // base64 string
  video?: string; // blob URL
  code?: string;  // full HTML for live preview
  map?: {
    name: string;
    embedUrl: string;
    mapUrl: string;
  };
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  parts?: MessagePart[];
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  currentInput: string;
  history: ChatHistoryItem[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  history: ChatHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}
