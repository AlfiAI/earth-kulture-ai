
export interface MessageProps {
  sender: 'ai' | 'user';
  content: string;
}

export interface InsightProps {
  title: string;
  description: string;
  type: 'environmental' | 'social' | 'governance';
}
