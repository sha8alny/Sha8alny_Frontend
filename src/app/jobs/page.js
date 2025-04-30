"use client";
import JobsExploreContainer from "@/app/components/modules/jobs/container/JobsExploreContainer";
import JobsFilterContainer from "../components/modules/jobs/container/JobFiltersContatiner";
import RecentSearchesContainer from "../components/modules/jobs/container/RecentSearchesContainer";
import LeftSidebar from "../components/modules/feed/container/LeftSidebar";
import { Suspense } from "react";


function JobsPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <main className="container mx-auto px-4 py-6 flex-1 order-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen">
          {/* Left sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20">
              <LeftSidebar />
            </div>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-6 space-y-6 order-3 lg:order-2">
            <Suspense fallback={<div>Loading...</div>}>
              <RecentSearchesContainer />
            </Suspense>
            <div className="bg-foreground rounded-2xl p-6 shadow-xl">
              <Suspense fallback={<div>Loading...</div>}>
                <JobsExploreContainer />
              </Suspense>
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="lg:col-span-3 order-2">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)]">
                <Suspense fallback={<div>Loading...</div>}>
                  <JobsFilterContainer />
                </Suspense>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobsPage;
