'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatPageProps = {
  rideId: string;
  userRole: 'rider' | 'captain';
  onBack: () => void;
};

export default function ChatPage({ rideId, userRole, onBack }: ChatPageProps) {
  const [newMessage, setNewMessage] = useState('');
  const { firestore, user: firebaseUser } = useFirebase();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, `rides/${rideId}/messages`), orderBy('timestamp')) : null,
  [firestore, rideId]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !firestore || !firebaseUser) return;

    const messagePayload: Omit<Message, 'id'> = {
      rideId,
      senderId: firebaseUser.uid,
      senderRole: userRole,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    };

    try {
        await addDoc(collection(firestore, `rides/${rideId}/messages`), messagePayload);
        setNewMessage('');
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  return (
    <div className="flex flex-col h-screen bg-secondary/30">
      <header className="flex items-center p-2 border-b sticky top-0 bg-background z-10 h-[65px] shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="ml-4">
            <h1 className="text-lg font-bold">Chat with {userRole === 'rider' ? 'your Captain' : 'your Rider'}</h1>
            <p className="text-xs text-muted-foreground">Ride ID: {rideId.substring(0, 6)}...</p>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
            {isLoading && <p className="text-center text-muted-foreground">Loading chat...</p>}
            {messages?.map(message => {
                const isSentByMe = message.senderRole === userRole;
                return (
                    <div key={message.id} className={cn("flex items-end gap-2", isSentByMe ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[75%] p-3 rounded-2xl",
                            isSentByMe 
                                ? "bg-primary text-primary-foreground rounded-br-none" 
                                : "bg-card text-card-foreground rounded-bl-none border"
                        )}>
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1 text-right">
                                {message.timestamp?.toDate ? format(message.timestamp.toDate(), 'p') : '...'}
                            </p>
                        </div>
                    </div>
                );
            })}
             {!isLoading && messages?.length === 0 && (
                <div className="text-center text-muted-foreground pt-20">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            )}
        </div>
      </ScrollArea>

      <footer className="p-2 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="h-12 flex-1 bg-secondary border-none"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="h-12 w-12" disabled={!newMessage.trim()}>
            <Send />
          </Button>
        </form>
      </footer>
    </div>
  );
}