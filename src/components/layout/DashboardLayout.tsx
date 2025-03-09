
import { ReactNode, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileSidebarToggle from "./MobileSidebarToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set sidebar closed by default on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't render on first client mount to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        <Sidebar isCollapsed={!sidebarOpen} />
        <main
          className={`flex-1 transition-all duration-200 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-16"
          }`}
        >
          {children}
        </main>
      </div>
      
      {isMobile && !sidebarOpen && (
        <MobileSidebarToggle onToggle={toggleSidebar} />
      )}
    </div>
  );
};

export default DashboardLayout;
