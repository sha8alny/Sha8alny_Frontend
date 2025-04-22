"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import FlagIcon from "@mui/icons-material/Flag";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BarChartIcon from '@mui/icons-material/BarChart';
import { SidebarPresentation } from "../presentation/SidebarPresentation";
import WorkIcon from '@mui/icons-material/Work';
import ReportIcon from '@mui/icons-material/Report';
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
      name: "Analytics",
      path: "/admin/analytics",
      icon: QueryStatsIcon,
    },
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

    {
      name: "Manage Inappropriate Content",
      path: "/admin/inappropriate-content",
      icon: ReportIcon,
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