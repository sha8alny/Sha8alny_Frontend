"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/Avatar"
// Import MUI icons
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DescriptionIcon from '@mui/icons-material/Description'; // Equivalent for FileText
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie'; // Equivalent for Film
import { formatTime } from "@/app/utils/utils"
import { green } from "@mui/material/colors";

// Helper function to format date for day separators
export function formatMessageDate(timestamp) {
    // Assuming timestamp is now a string like "YYYY-MM-DDTHH:mm:ssZ" or similar
    // Or if it's still a Firestore Timestamp object, .toDate() works
    const date = typeof timestamp?.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
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

export function MessageBubble({ message, isCurrentUser, participantName, participantPicture, showDateSeparator }) {
    const [imageLoaded, setImageLoaded] = useState(false)
    //console.log("MessageBubble", message, isCurrentUser, participantName, participantPicture)
    const getFileIcon = (file) => {
        // If file is a string (URL), extract extension from it
        if (typeof file === 'string') {
            const extension = file.split(".").pop()?.toLowerCase()

            if (extension === "pdf") {
                return <DescriptionIcon className="h-4 w-4" />
            } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
                return <ImageIcon className="h-4 w-4" />
            } else if (["mp4", "webm", "mov"].includes(extension || "")) {
                return <MovieIcon className="h-4 w-4" />
            }
        }
        // If file is a File object, check its name or type
        else if (file instanceof File || (file && file.name)) {
            const fileName = file.name || '';
            const fileType = file.type || '';

            if (fileType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) {
                return <ImageIcon className="h-4 w-4" />
            } else if (fileType.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(fileName)) {
                return <MovieIcon className="h-4 w-4" />
            } else if (fileType === 'application/pdf' || /\.pdf$/i.test(fileName)) {
                return <DescriptionIcon className="h-4 w-4" />
            }
        }

        return <DescriptionIcon className="h-4 w-4" /> // Default icon
    }

    const renderMedia = (media, index) => {
        let file, url;

        // Handle different media formats
        if (typeof media === 'string') {
            url = media;
            file = null;
        } else if (media && media.url) {
            url = media.url;
            file = null;
        } else if (media instanceof File || (media && media.name)) {
            file = media;
            url = file.type.startsWith('image/') || file.type.startsWith('video/')
                ? URL.createObjectURL(file)
                : null;
        } else if (media && media.content && (media.content instanceof File || media.content.name)) {
            file = media.content;
            url = file.type.startsWith('image/') || file.type.startsWith('video/')
                ? URL.createObjectURL(file)
                : null;
        } else {
            return null; // Can't render this media type
        }

        const fileName = file ? file.name : url?.split("/").pop() || "File";
        const fileType = file ? file.type : "";
        const extension = fileName.split(".").pop()?.toLowerCase();

        if (fileType.startsWith('image/') || ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
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
        } else if (fileType.startsWith('video/') || ["mp4", "webm", "mov"].includes(extension)) {
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
                    {/* Use MUI getFileIcon */}
                    {getFileIcon(file || url)}
                    <span className="truncate max-w-[200px]">{fileName}</span>
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
                        {/* Use participantPicture passed down */}
                        <AvatarImage src={participantPicture || "/placeholder.svg"} alt={participantName} />
                        <AvatarFallback>{participantName?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                )}
                <div>
                    <div className={`rounded-xl p-3 w-fit ${isCurrentUser ? "bg-secondary ml-auto" : "bg-primary text-primary-foreground"}`}>
                        {Array.isArray(message.messageContent) ? (
                            <div className="space-y-2">
                                {message.messageContent.map((item, index) => {
                                    if (item.type === 'text') {
                                        return <div key={index}>{item.content}</div>;
                                    } else if (item.type === 'media') {
                                        return renderMedia(item.content || item, index);
                                    }
                                    return null;
                                })}
                            </div>
                        ) : (
                            message.messageContent
                        )}
                    </div>
                    <div className={`flex items-center text-xs text-muted-foreground mt-1 ${isCurrentUser ? "justify-end" : ""}`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {isCurrentUser && message.read && <DoneAllIcon  className=" ml-1 " sx={{ fontSize: 20, color: green[400]}}/>}
                    </div>
                </div>
            </div>
        </>
    )
}
