
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatButtonAvatarProps {
  avatarPath: string;
}

const ChatButtonAvatar = ({ avatarPath }: ChatButtonAvatarProps) => {
  // Verify the avatar image can be loaded
  useEffect(() => {
    const img = new Image();
    img.onload = () => console.log("Waly avatar image loaded successfully");
    img.onerror = () => console.error("Failed to load Waly avatar image");
    img.src = avatarPath;
  }, [avatarPath]);

  return (
    <Avatar className="w-14 h-14 border-2 border-primary/10 overflow-visible">
      <AvatarImage 
        src={avatarPath} 
        alt="Waly Bot"
        className="object-contain p-1" 
      />
      <AvatarFallback className="bg-white dark:bg-gray-800">
        <div className="h-full w-full flex items-center justify-center text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default ChatButtonAvatar;
