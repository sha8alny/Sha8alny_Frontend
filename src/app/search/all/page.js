"use client";
import { Suspense } from "react";
import AllPageContainer from "@/app/components/modules/search/container/AllPageContainer";
export default function Page() {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            Loading...
          </div>
        }
      >
        <AllPageContainer />
      </Suspense>
    </div>
  );
}
