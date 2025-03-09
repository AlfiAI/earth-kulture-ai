
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ChatButtonAvatarProps {
  avatarPath: string;
}

const ChatButtonAvatar = ({ avatarPath }: ChatButtonAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.error("Failed to load avatar image:", avatarPath);
    setImageError(true);
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {!imageError ? (
        <img 
          src={avatarPath} 
          alt="Waly AI" 
          className="w-full h-full object-contain p-2.5"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatButtonAvatar;
