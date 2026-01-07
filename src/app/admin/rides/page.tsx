'use client';
import type { User, Screen, Ride } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { format } from 'date-fns';

type AdminRidesPageProps = {
  user: User | null;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
};

export default function AdminRidesPage({ user, onLogout, navigateTo, currentScreen }: AdminRidesPageProps) {
  const { firestore } = useFirebase();

  const ridesQuery = useMemoFirebase(() =>
    firestore ? query(collection(firestore, 'rides'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: rides, isLoading: ridesLoading } = useCollection<Ride>(ridesQuery);

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'ENDED':
      case 'PAID':
        return 'default';
      case 'ACCEPTED':
      case 'ARRIVED':
      case 'STARTED':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'ENDED':
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'ACCEPTED':
      case 'ARRIVED':
      case 'STARTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <AdminLayout user={user} onLogout={onLogout} navigateTo={navigateTo} currentScreen={currentScreen}>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Ride History & Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Captain</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Drop</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Fare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ridesLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">Loading rides...</TableCell>
                  </TableRow>
                )}
                {rides && rides.map((ride) => (
                  <TableRow key={ride.id}>
                    <TableCell className="font-medium">{ride.riderName || 'N/A'}</TableCell>
                    <TableCell>{ride.captainName || 'Not Assigned'}</TableCell>
                    <TableCell>{ride.pickupLocation}</TableCell>
                    <TableCell>{ride.dropLocation}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(ride.status)} className={getStatusClass(ride.status)}>
                        {ride.status || 'UNKNOWN'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ride.createdAt?.toDate ? format(ride.createdAt.toDate(), 'PPpp') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">₹{ride.estimatedFare?.toFixed(2) ?? '0.00'}</TableCell>
                  </TableRow>
                ))}
                {!ridesLoading && rides?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No rides found.
                    </TableCell>
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
