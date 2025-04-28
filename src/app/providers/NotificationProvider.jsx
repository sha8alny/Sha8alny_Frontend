"use client";
import { generateToken } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import  useFcmToken  from "@/app/hooks/useFcmToken";
const NotificationProvider = ({ children }) => {
const { token, notificationPermissionStatus } = useFcmToken();
  return <>{children}</>;
};

export default NotificationProvider;
