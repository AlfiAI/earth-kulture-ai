
import React from 'react';

const LegalDisclaimer = () => {
  return (
    <div className="text-xxs sm:text-xs text-center text-muted-foreground mt-4 sm:mt-6 px-2">
      By continuing, you agree to Earth Kulture's{" "}
      <a href="#" className="text-primary hover:underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="#" className="text-primary hover:underline">
        Privacy Policy
      </a>.
    </div>
  );
};

export default LegalDisclaimer;
