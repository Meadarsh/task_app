import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import api from "@/lib/api"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import useAuthStore from "@/app/store/user.state"
import { socket } from "@/lib/socket"
import { toast } from "./ui/use-toast"

interface Sender {
  _id: string;
  name: string;
  email: string;
}

interface Notification {
  _id: string;
  recipient: string;
  sender: Sender;
  task: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open,setOpen]=useState(true)
  const {user}=useAuthStore()
  const GetNotifications = async () => {
    try {
      const res = await api.get<Notification[]>("/notifications")
      if (res.status === 200) {
        setNotifications(res.data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    GetNotifications()
  }, [])
  useEffect(() => {
    if(open){GetNotifications()}
  }, [open])

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`, { read: true })
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, read: true } : notification
      ))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }
  const unreadCount = notifications.filter(n => !n.read).length

  const playNotificationSound = () => {
    const audio = new Audio("/sound.mp3")
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    socket.connect();
    socket.emit('authenticate',user?._id);
    socket.on('new-notification', (notification: Notification) => {
    playNotificationSound();
    console.log(notification);
    GetNotifications()
      toast({
        title: `New task from ${notification.sender.name}`,
        description: notification.message,
        duration: 5000,
      });
    });

    return () => {
      socket.off('new-notification');
      socket.disconnect();
    };
  }, [user?._id]);

  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button size="icon" variant="outline">
            <Bell className="h-4 w-4" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-0">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {unreadCount > 0 
              ? `${unreadCount} new notification${unreadCount > 1 ? 's' : ''}`
              : "No new notifications"}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="space-y-4 py-6 max-h-[calc(100vh-100px)] px-4">
          {notifications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 mb-2 rounded-lg border ${!notification.read ? 'bg-muted/50' : 'bg-background'} transition-colors cursor-pointer`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${notification.read ? 'bg-muted-foreground' : 'bg-primary'}`}></div>
                    <h3 className="font-medium text-sm">
                      {notification.sender.name}
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(notification.createdAt), 'MMM dd, h:mm a')}
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  {notification.message}
                </p>
                {notification.type === 'update' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      Update
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}