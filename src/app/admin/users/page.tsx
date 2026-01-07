'use client';

import type { User, Screen, UserProfile } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { XCircle } from 'lucide-react';

type AdminUsersPageProps = {
  user: User | null;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
};

export default function AdminUsersPage({ user, onLogout, navigateTo, currentScreen }: AdminUsersPageProps) {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() =>
    firestore ? collection(firestore, 'userProfiles') : null,
    [firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const handleBlockUser = (userId: string) => {
    // This is a placeholder function. In a real app, you'd update the user's status in Firestore.
    // e.g., const userRef = doc(firestore, 'userProfiles', userId);
    // await updateDoc(userRef, { status: 'blocked' });
    toast({
      variant: 'destructive',
      title: 'User Blocked',
      description: `User with ID ${userId.substring(0, 6)}... has been blocked. (Simulated)`,
    });
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} navigateTo={navigateTo} currentScreen={currentScreen}>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading users...</TableCell>
                  </TableRow>
                )}
                {users && users.map((appUser) => (
                  <TableRow key={appUser.id}>
                    <TableCell className="font-medium">{appUser.name || 'N/A'}</TableCell>
                    <TableCell>{appUser.email || 'N/A'}</TableCell>
                    <TableCell>{appUser.phone || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-xs">{appUser.id}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleBlockUser(appUser.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Block
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!usersLoading && users?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No users found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
