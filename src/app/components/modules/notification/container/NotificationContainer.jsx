"use client"

import { useState, useEffect } from "react"
import { fetchNotifications, markNotificationAsRead } from "@/app/services/notificationService"
import NotificationPresentation from "../presentation/NotificationPresentation"

/**
 * Container component for notifications that manages state and business logic
 */
export default function NotificationContainer() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchNotifications(10, 0)
        if (result && result.notifications) {
          setNotifications(result.notifications)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        setError("Failed to load notifications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getNotifications()
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId)
      // Update local state
      setNotifications((prev) => 
        prev.map((note) => (note._id === notificationId ? { ...note, isRead: true } : note))
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "Like":
      case "Comment":
        return `/posts/${notification.data?.postId || ''}`;
      case "Follow":
        return `/profile/${notification.data?.userId || ''}`;
      case "Message":
        return `/messages/${notification.data?.conversationId || ''}`;
      default:
        return "#";
    }
  }
  console.log(notifications)
  const unreadCount = notifications.filter((note) => !note.isRead).length
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter((note) => !note.isRead)

  return (
    <NotificationPresentation 
      notifications={notifications}
      loading={loading}
      error={error}
      activeTab={activeTab}
      unreadCount={unreadCount}
      onTabChange={setActiveTab}
      onMarkAsRead={handleMarkAsRead}
      getNotificationLink={getNotificationLink}
    />
  )
}