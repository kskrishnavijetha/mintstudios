import { Home, Settings, HelpCircle, Twitter } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center gap-3 mb-8 px-2">
          <img 
            src="/lovable-uploads/ecff42f8-bf0a-4321-a99d-7233333a68ac.png" 
            alt="MintStudio Logo" 
            className="h-10 w-10 object-contain"
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
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a 
                href="https://x.com/Mintstudioio" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
                <span>Follow us</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};