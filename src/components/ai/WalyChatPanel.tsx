
import { RefObject } from 'react';
import ChatPanelWrapper from './chat-panel/ChatPanelWrapper';
import { MessageProps } from './Message';

interface WalyChatPanelProps {
  isOpen: boolean;
  position: { bottom: number; right: number };
  chatRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  messages: MessageProps[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isTyping: boolean;
  handleSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  showNewChat: boolean;
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
  starters: Array<{ text: string; icon: React.ReactNode }>;
}

const WalyChatPanel = (props: WalyChatPanelProps) => {
  return <ChatPanelWrapper {...props} />;
};

export default WalyChatPanel;
