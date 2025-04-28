"use client";

import JobDetailsContainer from "@/app/components/modules/jobs/container/JobsDetailsContainer";
import JobsExploreContainer from "@/app/components/modules/jobs/container/JobsExploreContainer";
import { ScrollArea } from "@/app/components/ui/ScrollArea";


export default function JobDetails() {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar with Jobs Explorer */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-20">
              <div className="bg-foreground rounded-2xl p-4 shadow-xl h-[calc(100vh-6rem)]">
                <ScrollArea className="h-full">
                  <JobsExploreContainer />
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Main Content - Job Details */}
          <div className="w-full md:w-2/3 lg:w-2/3 bg-foreground rounded-2xl shadow-xl p-6 order-first md:order-last">
            <JobDetailsContainer />
          </div>
        </div>
      </div>
    </div>
  );
}