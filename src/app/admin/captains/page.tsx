'use client';

import type { User, Screen } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import type { CaptainProfile } from '@/lib/types';


type AdminCaptainsPageProps = {
  user: User | null;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
};

export default function AdminCaptainsPage({ user, onLogout, navigateTo, currentScreen }: AdminCaptainsPageProps) {
  const { firestore, user: firebaseUser } = useFirebase();
  const { toast } = useToast();

  const captainsQuery = useMemoFirebase(() =>
    // Only create the query if both firestore and a logged-in user exist.
    firestore ? collection(firestore, 'captainProfiles') : null,
    [firestore]);
  const { data: captains, isLoading: captainsLoading } = useCollection<CaptainProfile>(captainsQuery);

  const handleStatusChange = async (captainId: string, newStatus: 'approved' | 'blocked') => {
    if (!firestore) return;
    const captainRef = doc(firestore, 'captainProfiles', captainId);
    try {
      await updateDoc(captainRef, { status: newStatus });
      toast({
        title: 'Captain status updated!',
        description: `Captain has been ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message,
      });
    }
  };


  return (
    <AdminLayout user={user} onLogout={onLogout} navigateTo={navigateTo} currentScreen={currentScreen}>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Captain Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captainsLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading captains...</TableCell>
                  </TableRow>
                )}
                {captains && captains.map((captain) => (
                  <TableRow key={captain.id}>
                    <TableCell className="font-medium">{captain.name || 'N/A'}</TableCell>
                    <TableCell>{captain.vehicleType || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={captain.status === 'approved' ? 'default' : captain.status === 'blocked' ? 'destructive' : 'secondary'}
                        className={
                          captain.status === 'approved' ? 'bg-green-100 text-green-800' :
                            captain.status === 'blocked' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {captain.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {captain.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mr-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleStatusChange(captain.id, 'approved')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      )}
                      {captain.status !== 'blocked' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleStatusChange(captain.id, 'blocked')}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Block
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
