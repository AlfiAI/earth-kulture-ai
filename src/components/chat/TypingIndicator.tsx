
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TypingIndicator = () => {
  const walyAvatarPath = "/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 items-start p-2"
    >
      <Avatar className="h-10 w-10 border-2 border-emerald-100 shadow-sm">
        <AvatarImage src={walyAvatarPath} alt="Waly" className="p-1" />
        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white" />
      </Avatar>
      
      <div className="rounded-2xl p-4 max-w-[75%] shadow-sm bg-white border border-gray-100">
        <div className="flex space-x-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, delay: 0.4, repeat: Infinity, repeatType: "loop" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
