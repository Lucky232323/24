'use client';
import { useState, ChangeEvent } from 'react';
import Layout from '@/components/app/Layout';
import type { Screen, User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronRight,
  Gift,
  HelpCircle,
  History,
  LogOut,
  Settings,
  Shield,
  Star,
  Wallet,
  Coins,
  Award,
  Power,
  Bell,
  CreditCard,
  MessageSquareQuote,
  Trash2,
  Edit,
  User as UserIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type ProfilePageProps = {
  user: User | null;
  navigateTo: (screen: Screen) => void;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
};

export default function ProfilePage({ user, navigateTo, onUserUpdate, onLogout }: ProfilePageProps) {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setProfilePic(e.target.result);
          toast({ title: 'Profile picture updated!' });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const accountItems = [
    { label: 'My Rides', icon: History, screen: 'ride-history' as Screen },
    { label: 'My Rating', icon: Star, screen: 'my-rating' as Screen },
    { label: 'Payments', icon: CreditCard, screen: 'payments' as Screen },
    { label: 'Wallet', icon: Wallet, screen: 'wallet' as Screen },
  ];
  
  const offersItems = [
      { label: 'My Rewards', icon: Award, screen: 'rewards' as Screen },
      { label: 'RIDER APP Coins', icon: Coins, screen: 'coins' as Screen },
      { label: 'Power Pass', icon: Power, screen: 'power-pass' as Screen },
      { label: 'Refer and Earn', icon: Gift, screen: 'refer' as Screen },
  ];

  const supportItems = [
    { label: 'Notifications', icon: Bell, screen: 'notifications' as Screen },
    { label: 'Safety', icon: Shield, screen: 'safety' as Screen },
    { label: 'Help', icon: HelpCircle, screen: 'help' as Screen },
    { label: 'Claims', icon: MessageSquareQuote, screen: 'claims' as Screen },
    { label: 'Settings', icon: Settings, screen: 'settings' as Screen },
  ];

  return (
    <Layout title="My Account" navigateTo={navigateTo}>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-pic-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-pic-upload" className="cursor-pointer group">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                {profilePic ? (
                  <img src={profilePic} alt={user?.name || ''} className="aspect-square h-full w-full object-cover" />
                ) : (
                  <AvatarFallback className="text-4xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                )}
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-primary rounded-full p-1.5 border-2 border-background group-hover:bg-primary/90 transition-colors">
                <Edit className="h-4 w-4 text-primary-foreground" />
              </div>
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.phone}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {user?.gender && (
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <UserIcon className="h-5 w-5 text-muted-foreground"/>
                        <p className="font-medium">Gender</p>
                        <p className="ml-auto text-muted-foreground capitalize">{user.gender}</p>
                    </div>
                </CardContent>
            </Card>
        )}

        <Card>
          <CardContent className="p-2">
            {accountItems.map((item, index) => (
              <MenuItem key={index} item={item} navigateTo={navigateTo} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            {offersItems.map((item, index) => (
              <MenuItem key={index} item={item} navigateTo={navigateTo} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            {supportItems.map((item, index) => (
              <MenuItem key={index} item={item} navigateTo={navigateTo} />
            ))}
          </CardContent>
        </Card>

        <Card>
           <CardContent className="p-2">
             <button className="flex items-center w-full p-3 text-left hover:bg-secondary rounded-md text-destructive" onClick={onLogout}>
                <LogOut className="h-5 w-5 mr-4" />
                <span className="flex-1 text-base font-medium">Logout</span>
              </button>
             <Separator />
              <button className="flex items-center w-full p-3 text-left hover:bg-secondary rounded-md text-destructive/70" onClick={() => toast({title: "This action is permanent and cannot be undone."})}>
                <Trash2 className="h-5 w-5 mr-4" />
                <span className="flex-1 text-base font-medium">Delete Account</span>
              </button>
           </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


const MenuItem = ({ item, navigateTo }: { item: { label: string, icon: React.ElementType, screen: Screen }, navigateTo: (screen: Screen) => void }) => (
    <button
        className="flex items-center w-full p-3 text-left hover:bg-secondary rounded-md"
        onClick={() => navigateTo(item.screen)}
    >
        <item.icon className="h-6 w-6 mr-4 text-primary" />
        <span className="flex-1 text-base font-medium">{item.label}</span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
);
