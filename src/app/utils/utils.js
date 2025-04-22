
export function formatDistanceToNow(timestamp) {
    
    const now = new Date();
    let date;
    if (timestamp && typeof timestamp.toDate === 'function') {
        // Handle Firestore timestamp
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        // Handle ISO string or timestamp number
        date = new Date(timestamp);
    }
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    } else {
        return date.toLocaleDateString();
    }
}

export function formatTime(timestamp) {
    let date;
    
    if (timestamp && typeof timestamp.toDate === 'function') {
        // Handle Firestore timestamp
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        // Handle ISO string or timestamp number
        date = new Date(timestamp);
    } else {
        return 'Invalid time';
    }
    
    try {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Invalid time';
    }
}

