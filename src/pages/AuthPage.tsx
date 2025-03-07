
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { Leaf } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    // Navigate to dashboard on successful authentication
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <Leaf className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Earth Kulture</span>
      </div>
      <AuthForm onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default AuthPage;
