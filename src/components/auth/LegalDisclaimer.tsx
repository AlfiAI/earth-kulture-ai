
import React from 'react';

const LegalDisclaimer = () => {
  return (
    <div className="text-xs text-center text-muted-foreground mt-6">
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
