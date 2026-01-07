'use client';
import Layout from '@/components/app/Layout';
import { Card, CardContent } from '@/components/ui/card';
import type { Screen } from '@/lib/types';
import { Tag, CheckCircle } from 'lucide-react';

type NotificationsPageProps = {
  navigateTo: (screen: Screen) => void;
};

const notifications = [
    {
        icon: Tag,
        title: "50% OFF on your next 2 rides!",
        description: "Use code RIDER50 to get a discount. Valid for a limited time.",
        time: "2 hours ago",
        read: false,
    },
    {
        icon: CheckCircle,
        title: "Ride to Koramangala Completed",
        description: "Your ride was successfully completed. Hope you had a great trip!",
        time: "1 day ago",
        read: true,
    }
];

export default function NotificationsPage({ navigateTo }: NotificationsPageProps) {
  return (
    <Layout title="Notifications" navigateTo={navigateTo}>
        <div className="p-4 space-y-4">
            {notifications.map((notif, index) => (
                <Card key={index} className={notif.read ? 'opacity-60' : ''}>
                    <CardContent className="flex items-start gap-4 p-4">
                        <notif.icon className={`h-6 w-6 mt-1 flex-shrink-0 ${notif.read ? 'text-muted-foreground' : 'text-primary'}`} />
                        <div className="flex-1">
                            <h3 className="font-semibold">{notif.title}</h3>
                            <p className="text-sm text-muted-foreground">{notif.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                    </CardContent>
                </Card>
            ))}
             {notifications.length === 0 && (
                <div className="text-center py-20">
                <p className="text-muted-foreground">You have no new notifications.</p>
                </div>
            )}
        </div>
    </Layout>
  );
}
