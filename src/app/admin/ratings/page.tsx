'use client';
import type { User, Screen, Ride } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, limit } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

type AdminRatingsPageProps = {
  user: User | null;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
};

export default function AdminRatingsPage({ user, onLogout, navigateTo, currentScreen }: AdminRatingsPageProps) {
  const { firestore } = useFirebase();

  // Fetch rides that have a rating
  // Note: Firestore doesn't support != null easily without complex indexing alongside other filters.
  // For this demo, we'll fetch recent rides and filter client-side for those with ratings.
  // In a prod app, you'd have a specific 'reviews' collection or an indexed field 'hasRating: true'.
  const ridesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'rides'), orderBy('createdAt', 'desc'), limit(50));
  }, [firestore]);

  const { data: rides, isLoading } = useCollection<Ride>(ridesQuery);

  const ratedRides = rides?.filter(r => r.captain && r.captain.rating) || [];

  return (
    <AdminLayout user={user} onLogout={onLogout} navigateTo={navigateTo} currentScreen={currentScreen}>
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Ratings & Feedback</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="col-span-3 text-center py-8 text-muted-foreground animate-pulse">Loading reviews...</p>}

          {!isLoading && ratedRides.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Ratings Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                There are no rated rides in the recent history. Ratings will appear here once users provide feedback.
              </p>
            </div>
          )}

          {ratedRides.map((ride) => (
            <Card key={ride.id} className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-yellow-400">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={ride.captain?.image} alt={ride.captainName} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">{ride.captainName?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-sm truncate">{ride.captainName}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="truncate">By {ride.riderName}</span>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full text-sm font-bold shadow-sm">
                  {ride.captain?.rating?.toFixed(1)} <Star className="h-3.5 w-3.5 ml-1 fill-yellow-500 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 relative mt-1">
                  <MessageSquare className="h-4 w-4 absolute -top-2 -left-2 text-blue-500 fill-blue-100 dark:fill-blue-900" />
                  "Great ride, very smooth and fast!"
                  {/* Replace fixed text with actual review comment if available in Ride object */}
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                  <span>{ride.createdAt?.toDate ? format(ride.createdAt.toDate(), 'PP') : 'Recently'}</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">#{ride.id.substring(0, 6)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
