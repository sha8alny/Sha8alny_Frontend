import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/Avatar"
import { Button } from "@/app/components/ui/Button"
import { Card, CardContent } from "@/app/components/ui/Card"
import { Separator } from "@/app/components/ui/Separator"
import { Skeleton } from "@/app/components/ui/Skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Tabs"
import { Badge } from "@/app/components/ui/Badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/app/components/ui/Alert"

/**
 * @namespace notification
 * @module notification
 * Notification presentation component that renders the UI for notifications
 * 
 * @param {Object} props Component props
 * @param {Array} props.notifications List of notification objects
 * @param {boolean} props.loading Loading state of notifications
 * @param {string} props.error Error message if applicable
 * @param {string} props.activeTab Currently active tab ('all' or 'unread')
 * @param {number} props.unreadCount Count of unread notifications
 * @param {Function} props.onTabChange Callback when tab changes
 * @param {Function} props.onMarkAsRead Callback to mark a notification as read
 * @param {Function} props.getNotificationLink Function to get the link for a notification
 * @param {boolean} props.isMarkingAsRead Whether a notification is currently being marked as read
 * @returns {JSX.Element} Rendered component
 */
function NotificationPresentation({
  notifications,
  loading,
  error,
  activeTab,
  unreadCount,
  onTabChange,
  onMarkAsRead,
  getNotificationLink,
  isMarkingAsRead
}) {
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-text">Notifications</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-400" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full bg-gray-400 " />
                <Skeleton className="h-4 w-24 bg-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-text flex items-center gap-2">
          <NotificationsActiveIcon/> Notifications
        </h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-text flex items-center gap-2">
        <NotificationsActiveIcon/> Notifications
      </h1>

      <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center justify-center gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs text-background">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderNotificationList(notifications)}
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          {renderNotificationList(notifications.filter(n => !n.isRead))}
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderNotificationList(notifications) {
    if (notifications.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {activeTab === "all" ? "You have no notifications yet." : "You have no unread notifications."}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <div key={notification._id}>
            <Card className={notification.isRead ? "" : "bg-muted/50"}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={notification.data?.fromProfilePicture || "/placeholder.svg"}
                      alt={notification.data?.userName || "User"}
                    />
                    <AvatarFallback>
                      {(notification.data?.userName || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link href={getNotificationLink(notification)} className="text-sm font-medium hover:underline">
                      {notification.text || notification.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                      {notification.type && (
                        <Badge variant="outline" className="text-xs text-text">
                          {notification.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onMarkAsRead(notification._id)}
                      disabled={isMarkingAsRead}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            {index < notifications.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    )
  }
}

export default NotificationPresentation;