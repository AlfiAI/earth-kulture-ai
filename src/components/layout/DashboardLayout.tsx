
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
  const [autoHide, setAutoHide] = useState(false);

  // Track mouse position for auto-hide functionality
  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile) return;
    
    // Show sidebar when mouse is near the left edge of the screen
    if (e.clientX <= 20 && !sidebarOpen) {
      setSidebarOpen(true);
      setAutoHide(true);
    } 
    // Hide sidebar when mouse moves away from sidebar area and it was auto-shown
    else if (autoHide && e.clientX > 280 && sidebarOpen) {
      setSidebarOpen(false);
      setAutoHide(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Set sidebar closed by default on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }

    // Add mouse movement listener for auto-hide functionality
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, sidebarOpen, autoHide]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setAutoHide(false); // Reset auto-hide when manually toggled
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
