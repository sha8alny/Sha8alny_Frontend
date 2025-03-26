"use client";
import Head from "next/head";
import Navbar from "@/app/components/layout/NavBar";
import JobsExploreContainer from "@/app/components/modules/jobs/container/JobsExploreContainer";

export default function Home() {

  return (
    <div className="min-h-screen bg-background text-white">
      <Head>
        <title>Shaغalny - Job Search Platform</title>
      </Head>

      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <header>
          <Navbar />
        </header>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 ">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 order-first">
            <div className="sticky top-20 space-y-4">
              {/* <JobsLeftSideBar  /> */}
            </div>
          </div>

          {/* Middle Main Content */}
          <div className="w-full md:w-2/4 space-y-6 ">
            {/* Recent Searches */}
            <div className="bg-foreground rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-text">
                Recent searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {
                  //////////////////// TEMPORARY CODE ////////////////////
                }
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <button
                      key={i}
                      className="border border-blue-400 hover:bg-hover text-sm px-4 py-2 rounded-full text-blue-400"
                    >
                      BUTTON
                    </button>
                  ))}
              </div>
            </div>
            {
              //////////////////// TEMPORARY CODE ////////////////////
            }

            {/* Explore Jobs Section */}
            <div className="bg-foreground rounded-3xl p-6 shadow-xl">
              <JobsExploreContainer />
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="w-full md:w-1/4 -order-1 md:order-last">
            <div className="sticky top-20">
              {/* <JobsRightSideBar /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
