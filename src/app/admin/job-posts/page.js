"use client";

import { JobsTableContainer } from "@/app/components/modules/admin/container/JobsTableContainer";


const JobPostsAdmin = () => {
  return (
    <div>
      <div className="space-y-6 bg-background text-text">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 ">
          <h1 className="text-3xl font-bold">Job Postings</h1>
        </div>
        <JobsTableContainer/>
      </div>
    </div>
  );
};

export default JobPostsAdmin;
