
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  expanded: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, label, icon, active, expanded, onClick }: NavItemProps) => {
  return (
    <NavLink to={to} className="block" onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}>
      <Button
        variant={active ? "default" : "ghost"}
        size="sm"
        className={cn(
          "w-full",
          expanded ? "justify-start px-3" : "justify-center px-0"
        )}
      >
        {icon}
        {expanded && <span className="ml-2">{label}</span>}
      </Button>
    </NavLink>
  );
};

export default NavItem;
