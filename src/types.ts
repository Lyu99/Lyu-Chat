export interface ConversationProps {
  id: number;
  title: string;
  selectedModel: string;
  createdAt: string;
  updatedAt: string;
  providerId: number;
}
export interface ProviderProps {
    id: number;
    name: string;
    title?: string;
    desc?: string;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    models: string[];
}
