"use client"
import { useRouter } from "next/navigation";
import RightSidebarPresentation from "../presentation/RightSidebarPresentation";

/**
 * RightSidebar - Container component for the application's right sidebar
 * 
 * This component is responsible for:
 * - Providing navigation functionality to the presentation component
 * - Rendering the RightSidebarPresentation component with necessary props
 * 
 * It serves as a wrapper that isolates navigation logic from the presentation layer,
 * following the container/presentation pattern for better separation of concerns.
 * 
 * @returns {JSX.Element} Right sidebar component with navigation capabilities
 */
export default function RightSidebar() {
    const router = useRouter();

    /**
     * Handles navigation to different routes within the application
     * @param {string} path - The path to navigate to
     */
    const navigateTo = (path) => {
        router.push(path);
    }

    return (
    <RightSidebarPresentation 
        navigateTo={navigateTo}
        helperFunction={null}
    />
  );
}
