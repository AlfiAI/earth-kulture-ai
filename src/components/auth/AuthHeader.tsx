
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AuthHeaderProps = {
  authMode: 'login' | 'signup';
};

const AuthHeader = ({ authMode }: AuthHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute top-6 left-6 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <Leaf className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Earth Kulture</span>
      </div>
      
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
          <Leaf className="h-6 w-6" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Earth Kulture</h1>
        <p className="text-sm text-muted-foreground">ESG & Carbon Intelligence Platform</p>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {authMode === 'login' 
            ? 'Access your organization\'s sustainability dashboard' 
            : 'Join Earth Kulture to start monitoring your sustainability metrics'}
        </p>
      </div>
    </>
  );
};

export default AuthHeader;
