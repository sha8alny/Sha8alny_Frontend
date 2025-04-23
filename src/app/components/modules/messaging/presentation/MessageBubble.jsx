"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/Avatar"
import { Check, FileText, ImageIcon, Film } from "lucide-react"
import { formatTime } from "@/app/utils/utils"

// Helper function to format date for day separators
export function formatMessageDate(timestamp) {
    const date = timestamp.toDate()
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
        return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday"
    } else {
        return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    }
}

export function DateSeparator({ date }) {
    return (
        <div className="flex items-center justify-center my-4">
            <div className=" bg-primary/60  px-3 py-1 rounded-full text-xs text-foreground">
                {date}
            </div>
        </div>
    )
}

export function MessageBubble({ message, isCurrentUser, participantName, showDateSeparator }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    const getFileIcon = (url) => {
        const extension = url.split(".").pop()?.toLowerCase()

        if (extension === "pdf") {
            return <FileText className="h-4 w-4" />
        } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
            return <ImageIcon className="h-4 w-4" />
        } else if (["mp4", "webm", "mov"].includes(extension || "")) {
            return <Film className="h-4 w-4" />
        }

        return <FileText className="h-4 w-4" />
    }

    const renderMedia = (url, index) => {
        const extension = url.split(".").pop()?.toLowerCase()

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
            return (
                <div key={index} className="relative mt-2 rounded-md overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                    <img
                        src={url}
                        alt="Media"
                        className="max-w-[240px] max-h-[240px] object-contain rounded-md"
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
            )
        } else if (["mp4", "webm", "mov"].includes(extension || "")) {
            return (
                <div key={index} className="mt-2 rounded-md overflow-hidden">
                    <video src={url} controls className="max-w-[240px] max-h-[240px] object-contain rounded-md" />
                </div>
            )
        } else {
            return (
                <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
                >
                    {getFileIcon(url)}
                    <span className="truncate max-w-[200px]">{url.split("/").pop() || "File"}</span>
                </a>
            )
        }
    }

    return (
        <>
            {showDateSeparator && <DateSeparator date={formatMessageDate(message.timestamp)} />}
            <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}>
                {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={participantName ? `/api/avatar/${participantName}` : "/placeholder.svg"} alt={participantName} />
                        <AvatarFallback>{participantName?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                )}
                <div>
                    <div className={`rounded-xl p-3 ${isCurrentUser ? "bg-secondary " : "bg-primary text-primary-foreground"}`}>
                        {message.content}
                        {message.mediaUrls && message.mediaUrls.length > 0 && (
                            <div className="space-y-2">{message.mediaUrls.map((url, index) => renderMedia(url, index))}</div>
                        )}
                    </div>
                    <div className={`flex items-center text-xs text-muted-foreground mt-1 ${isCurrentUser ? "justify-end" : ""}`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {isCurrentUser && message.read && <Check className="h-3 w-3 ml-1 text-primary" />}
                    </div>
                </div>
            </div>
        </>
    )
}
