
import ChatPanelBodyContent from './ChatPanelBodyContent';
import ChatPanelInput from './ChatPanelInput';

interface ChatPanelContentProps {
  messages: any[];
  isTyping: boolean;
  showNewChat: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  starters: Array<{ text: string; icon: React.ReactNode }>;
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
  placeholder?: string;
}

const ChatPanelContent = ({
  messages,
  isTyping,
  showNewChat,
  inputValue,
  setInputValue,
  handleSend,
  starters,
  onStarterClick,
  onNewChat,
  placeholder
}: ChatPanelContentProps) => {
  return (
    <div className="flex flex-col h-[calc(100%-72px)]">
      <ChatPanelBodyContent
        messages={messages}
        isTyping={isTyping}
        showNewChat={showNewChat}
        starters={starters}
        onStarterClick={onStarterClick}
        onNewChat={onNewChat}
      />
      
      <ChatPanelInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ChatPanelContent;
