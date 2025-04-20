"use client";

import SettingsContainer from "@/app/components/modules/settings/container/SettingsContainer";
import { Suspense } from "react";
export default function Settings() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContainer />
    </Suspense>
  );
}
