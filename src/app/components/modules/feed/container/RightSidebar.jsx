"use client"
import { useRouter } from "next/navigation";
import RightSidebarPresentation from "../presentation/RightSidebarPresentation";

export default function RightSidebar() {
    const router = useRouter();

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
