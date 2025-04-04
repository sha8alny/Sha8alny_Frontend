"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import FlagIcon from "@mui/icons-material/Flag";
import { SidebarPresentation } from "../presentation/SidebarPresentation";
import WorkIcon from '@mui/icons-material/Work';
/**
 * @namespace admin
 * @module admin
 */
/**
 * SidebarContainer component is responsible for managing the state and logic
 * for the sidebar in the admin module. It uses the `usePathname` hook to get
 * the current pathname and manages the open/close state of the sidebar.
 *
 * @component
 * @returns {JSX.Element} The rendered SidebarContainer component.
 *
 */

export function SidebarContainer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      name: "Flagged Jobs",
      path: "/admin/flagged",
      icon: FlagIcon,
    },
    {
      name: "Manage Jobs",
      path: "/admin/job-posts",
      icon: WorkIcon,
    },
  ];

  return (
    <SidebarPresentation
      pathname={pathname}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      routes={routes}
    />
  );
}