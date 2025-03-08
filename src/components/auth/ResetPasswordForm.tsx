
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";

type ResetPasswordFormProps = {
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
  isSubmitting: boolean;
};

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ResetPasswordForm = ({ onBack, onSubmit, isSubmitting }: ResetPasswordFormProps) => {
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    await onSubmit(values.email);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 }
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.05
          }
        }
      }}
    >
      <motion.div variants={itemVariants} className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 mr-2" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">Reset Password</h2>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      {...field} 
                      className="h-10 text-base"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              size={isMobile ? "default" : "lg"}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" /> 
                  <span className="ml-2">Sending...</span>
                </>
              ) : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
};

export default ResetPasswordForm;
