import { Home, Settings, HelpCircle } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const XIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
            <SidebarMenuButton asChild>
              <a href="#token-creator">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#faq">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a 
                href="https://x.com/Mintstudioio" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <XIcon />
                <span>Follow us</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};