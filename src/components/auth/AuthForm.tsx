
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/contexts/auth";
import { MFASignInResult } from "@/contexts/auth/types";
import { itemVariants } from './authAnimations';
import EmailLoginForm from './EmailLoginForm';
import ResetPasswordForm from './ResetPasswordForm';

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type AuthFormProps = {
  authMode: 'login' | 'signup' | 'reset-password';
  onMFARequired: (factorId: string) => void;
  onError: (error: string) => void;
};

const AuthForm = ({ authMode, onMFARequired, onError }: AuthFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  // Handle login submission
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const result: MFASignInResult = await signIn(values.email, values.password, rememberMe);
      
      if (result.requiresMFA && result.factorId) {
        onMFARequired(result.factorId);
      }
    } catch (error: any) {
      onError(error.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      await signUp(values.email, values.password);
    } catch (error: any) {
      onError(error.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password reset submission
  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      await resetPassword(values.email);
    } catch (error: any) {
      onError(error.message || "An error occurred during password reset");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate form based on the auth mode
  if (authMode === 'reset-password') {
    return (
      <ResetPasswordForm 
        onSubmit={handleResetPassword} 
        isSubmitting={isSubmitting} 
      />
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <EmailLoginForm 
        onSubmit={authMode === 'login' ? handleLogin : handleSignup}
        authMode={authMode}
        isSubmitting={isSubmitting}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        onResetPassword={() => {}}
      />
    </motion.div>
  );
};

export default AuthForm;
