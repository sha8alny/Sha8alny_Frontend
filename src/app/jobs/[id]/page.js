// src/components/JobDetails/index.jsx
"use client";

import JobDetailsContainer from "@/app/components/modules/jobs/container/JobsDetailsContainer";
import JobsExploreContainer from "@/app/components/modules/jobs/container/JobsExploreContainer";
import Navbar from "@/app/components/layout/NavBar";

export default function JobDetails() {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <header>
          <Navbar />
        </header>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Left Sidebar with Jobs Explorer */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-20 space-y-4">
              <div className="bg-foreground rounded-3xl p-3 shadow-xl ">
                <div className="max-h-screen overflow-y-auto">
                <JobsExploreContainer />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Job Details */}
          <div className="w-full md:w-2/3 p-6 bg-foreground rounded-2xl shadow-lg order-first md:order-last">
            <JobDetailsContainer />
          </div>
        </div>
      </div>
    </div>
  );
}