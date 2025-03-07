
import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
        <main
          className={`flex-1 transition-all duration-200 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-16"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
