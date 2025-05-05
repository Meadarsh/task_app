import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function layout({children}:any) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <ScrollArea className=" lg:h-[calc(100vh-80px)] overflow-y-hidden"> {children}</ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
