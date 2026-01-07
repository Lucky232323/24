
'use client';

import type { User, Screen } from '@/lib/types';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  Bike,
  Activity,
  AlertOctagon,
  CreditCard,
  Tag,
  Star,
  Bell,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

type AdminLayoutProps = {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
  navigateTo: (screen: Screen) => void;
  currentScreen?: Screen;
};

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, screen: 'admin-dashboard' as Screen },
  { name: 'Captains', icon: Bike, screen: 'admin-captains' as Screen },
  { name: 'Users', icon: Users, screen: 'admin-users' as Screen },
  { name: 'Rides', icon: Activity, screen: 'admin-rides' as Screen },
  { name: 'Incidents', icon: AlertOctagon, screen: 'admin-sos-alerts' as Screen },
  { name: 'Payments', icon: CreditCard, screen: 'admin-payments' as Screen },
  { name: 'Offers & Promos', icon: Tag, screen: 'admin-offers' as Screen },
  { name: 'Ratings & Complaints', icon: Star, screen: 'admin-ratings' as Screen },
  { name: 'Notifications', icon: Bell, screen: 'admin-notifications' as Screen },
  { name: 'Settings', icon: Settings, screen: 'admin-settings' as Screen },
];

export default function AdminLayout({ user, onLogout, children, navigateTo, currentScreen }: AdminLayoutProps) {
  const { auth } = useFirebase();
  const { toast } = useToast();

  const handleLogoutClick = () => {
    if (auth) {
      auth.signOut().then(() => {
        onLogout();
        toast({ title: "Logged out successfully" });
      }).catch((error) => {
        toast({ variant: 'destructive', title: "Logout failed", description: error.message });
      });
    }
  };

  const pageTitle = menuItems.find(item => item.screen === currentScreen)?.name || 'Admin';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 p-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => item.screen && navigateTo(item.screen)}
                    isActive={item.screen === currentScreen}
                    tooltip={item.name}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className={item.badgeColor}>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="mt-auto border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-gray-100 dark:bg-black">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
                  <AvatarFallback className="bg-blue-600 text-white font-bold">{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name || 'Administrator'}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('admin-profile' as Screen)}>
                <Users className="mr-2 h-4 w-4" /> <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('admin-settings' as Screen)}>
                <Settings className="mr-2 h-4 w-4" /> <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600 focus:bg-red-50 cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
