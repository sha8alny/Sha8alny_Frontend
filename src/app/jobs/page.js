"use client";
import JobsExploreContainer from "@/app/components/modules/jobs/container/JobsExploreContainer";
import JobsFilterContainer from "../components/modules/jobs/container/JobFiltersContatiner";
import RecentSearchesContainer from "../components/modules/jobs/container/RecentSearchesContainer";
import LeftSidebar from "../components/modules/feed/container/LeftSidebar";
import { Suspense } from "react";
function JobsPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row gap-6 min-h-screen">
          <aside className="w-full md:w-1/4 order-first">
            <div className="sticky top-20 ">
              <LeftSidebar />
            </div>
          </aside>

          <section className="w-full md:w-2/4 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <RecentSearchesContainer />
            </Suspense>
            <div className="bg-foreground rounded-2xl p-6 shadow-xl">
              <Suspense fallback={<div>Loading...</div>}>
                <JobsExploreContainer />
              </Suspense>
            </div>
          </section>

          <aside className="w-full md:w-1/4 md:order-last">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden hover:overflow-y-auto scrollbar-hide">
              <div className="pr-2 ">
                <Suspense fallback={<div>Loading...</div>}>
                  <JobsFilterContainer />
                </Suspense>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobsPage;
