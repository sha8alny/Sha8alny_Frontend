import { FlaggedJobsTableContainer } from "@/app/components/modules/admin/container/FlaggedJobsTableContainer";

export default function FlaggedPage() {
  return (
    <div className="space-y-6 bg-background text-text">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 ">
        <h1 className="text-3xl font-bold">Flagged Job Listings</h1>
      </div>
      <FlaggedJobsTableContainer />
    </div>
  );
}
