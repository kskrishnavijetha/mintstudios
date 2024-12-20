import { Home, Settings, HelpCircle } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export const AppSidebar = () => {
  return (
    <aside className="h-screen w-[250px] border-r border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-8">
        <img 
          src="/lovable-uploads/ecff42f8-bf0a-4321-a99d-7233333a68ac.png" 
          alt="MintStudio Logo" 
          className="h-8 w-8"
        />
        <span className="font-semibold text-xl">MintStudio</span>
      </div>
      
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </aside>
  );
};