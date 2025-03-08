
interface PageViewParams {
  path: string;
  title?: string;
}

interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

// Determine if we should initialize analytics
const shouldInitialize = import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initAnalytics = () => {
  if (!shouldInitialize) return;
  
  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize the dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
    send_page_view: false // We'll handle page views manually
  });
  
  console.log("Analytics initialized");
};

// Track page views
export const trackPageView = ({ path, title }: PageViewParams) => {
  if (!shouldInitialize) return;
  
  try {
    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      send_to: import.meta.env.VITE_GA_MEASUREMENT_ID,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track custom events
export const trackEvent = ({ action, category, label, value, nonInteraction = false }: EventParams) => {
  if (!shouldInitialize) return;
  
  try {
    window.gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value,
      non_interaction: nonInteraction,
      send_to: import.meta.env.VITE_GA_MEASUREMENT_ID,
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Set user ID for analytics
export const setUserID = (userId: string) => {
  if (!shouldInitialize || !userId) return;
  
  try {
    window.gtag?.('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      user_id: userId
    });
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
};
