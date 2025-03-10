
import { ReactNode } from "react";

interface InsightsLayoutProps {
  children: ReactNode;
}

const InsightsLayout = ({ children }: InsightsLayoutProps) => {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4 md:px-6">
      {children}
    </div>
  );
};

export default InsightsLayout;
