
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingSpinner from "./LoadingSpinner";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type EmailLoginFormProps = {
  onSubmit: (values: z.infer<typeof loginSchema>) => void;
  authMode: 'login' | 'signup' | 'reset-password';
  isSubmitting: boolean;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  onResetPassword: () => void;
};

const EmailLoginForm = ({ 
  onSubmit, 
  authMode, 
  isSubmitting, 
  rememberMe, 
  setRememberMe, 
  onResetPassword 
}: EmailLoginFormProps) => {
  const isMobile = useIsMobile();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <motion.div variants={itemVariants}>
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
                    className="h-9 sm:h-10 text-sm sm:text-base"
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  {authMode === 'login' && (
                    <Button 
                      variant="link" 
                      className="px-0 h-auto text-xs font-normal" 
                      type="button"
                      onClick={onResetPassword}
                    >
                      Forgot password?
                    </Button>
                  )}
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="h-9 sm:h-10 text-sm sm:text-base"
                    disabled={isSubmitting}
                    autoComplete={authMode === 'login' ? "current-password" : "new-password"}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        </motion.div>

        {authMode === 'login' && (
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label 
              htmlFor="remember-me" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me
            </label>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <Button 
            type="submit" 
            className="w-full" 
            size={isMobile ? "sm" : "lg"}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">{authMode === 'login' ? 'Signing In...' : 'Signing Up...'}</span>
              </>
            ) : (
              <>
                {authMode === 'login' ? 'Sign In' : 'Sign Up'} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default EmailLoginForm;
