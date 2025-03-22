// src/components/JobDetails/index.jsx
"use client";

import JobDetailsContainer from "@/app/components/modules/jobs/container/JobsDetailsContainer";

export default function JobDetails() {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-10 ">
      <div className="p-8 max-w-4xl w-full mx-auto bg-foreground rounded-3xl shadow-lg">
        <JobDetailsContainer />
      </div>
    </div>
  );
}
