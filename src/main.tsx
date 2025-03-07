
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx'
import './index.css'

// Get Auth0 credentials from environment variables
const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';

// Get the current origin for callback URLs
const origin = window.location.origin;

// Check if credentials are available
const isAuth0Configured = domain && clientId;

// Log configuration status for debugging
if (!isAuth0Configured) {
  console.warn('Auth0 is not configured. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.');
}

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
    skipRedirectCallback={window.location.pathname === '/auth'}  // Prevent redirect loop
  >
    <App />
  </Auth0Provider>
);
