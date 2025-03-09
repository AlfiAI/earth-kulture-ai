
import { SidebarProvider } from "@/components/ui/sidebar/SidebarProvider";
import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";

interface InsightsLayoutProps {
  children: React.ReactNode;
}

const InsightsLayout = ({ children }: InsightsLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 px-4 py-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InsightsLayout;
