
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx'
import './index.css'

// Default values for local development - you'll need to replace these with your actual Auth0 credentials
const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-example.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'exampleClientId123456';

// Get the current origin for callback URLs
const origin = window.location.origin;

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: `${origin}/auth`,  // Redirect to the auth page after login
      scope: 'openid profile email',
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,  // Optional: API audience if using API authorization
    }}
    cacheLocation="localstorage"  // Store auth state in localStorage to persist between page refreshes
  >
    <App />
  </Auth0Provider>
);
