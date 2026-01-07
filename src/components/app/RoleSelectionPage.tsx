'use client';
import { Bike, Shield, UserCog } from 'lucide-react';
import { Card } from '../ui/card';

type RoleSelectionPageProps = {
  onRoleSelect: (role: 'rider' | 'captain' | 'admin') => void;
};

export default function RoleSelectionPage({ onRoleSelect }: RoleSelectionPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">RIDER APP</h1>
        <p className="text-muted-foreground mt-2">Your smart ride-hailing app</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Card
          className="p-6 flex items-center gap-4 cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => onRoleSelect('rider')}
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <Bike className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Continue as Rider</h2>
            <p className="text-muted-foreground text-sm">Book and manage your rides</p>
          </div>
        </Card>

        <Card
          className="p-6 flex items-center gap-4 cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => onRoleSelect('captain')}
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Captain Login</h2>
            <p className="text-muted-foreground text-sm">Manage your rides and earnings</p>
          </div>
        </Card>

        <Card
          className="p-6 flex items-center gap-4 cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => onRoleSelect('admin')}
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <UserCog className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Admin Login</h2>
            <p className="text-muted-foreground text-sm">Access the management dashboard</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
