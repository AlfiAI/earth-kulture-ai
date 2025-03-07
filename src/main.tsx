
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx'
import './index.css'

// Default values for local development - you'll need to replace these with your actual Auth0 credentials
const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-example.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'exampleClientId123456';

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: 'openid profile email'
    }}
  >
    <App />
  </Auth0Provider>
);
