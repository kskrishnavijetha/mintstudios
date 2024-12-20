import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Home, Plus, Settings } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="border-none">
      <SidebarHeader className="flex items-center gap-2 px-4">
        <img
          src="/lovable-uploads/f291cd72-7996-47aa-a5ad-c333db8e67bd.png"
          alt="MintStudio Logo"
          className="h-8"
        />
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 px-2">
          <a
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            Home
          </a>
          <a
            href="/create"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            Create Token
          </a>
          <a
            href="/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}