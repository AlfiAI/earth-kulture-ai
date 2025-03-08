
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

type AnimatedAlertProps = {
  variant?: "default" | "success";
  message: string;
};

const AnimatedAlert = ({ variant = "default", message }: AnimatedAlertProps) => {
  const isSuccess = variant === "success";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <Alert className={`${isSuccess ? "bg-green-50 border-green-200 text-green-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
        <Info className={`h-4 w-4 ${isSuccess ? "text-green-600" : "text-blue-600"}`} />
        <AlertDescription className="text-sm">
          {message}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default AnimatedAlert;
