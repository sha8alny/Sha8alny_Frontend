import { CreditCard, MessageSquare, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";

import TrendingKeywordsChart from "@/app/components/modules/admin/presentation/TrendingKeywordsChart";
import IndustryJobsChart from "@/app/components/modules/admin/presentation/IndustryJobsChart";
import PremiumUsersChart from "@/app/components/modules/admin/presentation/PremiumUsersChart";
import TopHiringCompaniesChart from "@/app/components/modules/admin/presentation/TopHiringCompaniesChart";
import UserRegistrationsChart from "@/app/components/modules/admin/presentation/UserRegistrationsChart";
import MostActiveUsersTable from "@/app/components/modules/admin/presentation/MostActiveUsersTable";
import { Skeleton } from "@/app/components/ui/Skeleton";

function DashboardPresentation({ data, isLoading }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex flex-1 flex-col w-full">
          <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Analytics
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card className="flex flex-col gap-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl md:text-3xl font-bold">
                      {data?.platformStats.totalUsers.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="flex flex-col gap-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Premium Users
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl md:text-3xl font-bold">
                      {data?.platformStats.premiumUsers.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="flex flex-col gap-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Jobs
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl md:text-3xl font-bold">
                      {data?.platformStats.totalJobs.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="py-6">
              <CardHeader>
                <CardTitle>Weekly User Registrations</CardTitle>
                <CardDescription>
                  New user registrations over the past 4 weeks
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <UserRegistrationsChart
                    data={data?.userRegistrationsByWeek}
                  />
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Premium vs Basic Users</CardTitle>
                  <CardDescription>
                    Distribution of user subscription types
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <PremiumUsersChart
                      premiumUsers={data?.platformStats.premiumUsers}
                      totalUsers={data?.platformStats.totalUsers}
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Top Hiring Companies</CardTitle>
                  <CardDescription>
                    Companies with the most job postings
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <TopHiringCompaniesChart data={data?.topHiringCompanies} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Trending Keywords in Posts</CardTitle>
                  <CardDescription>
                    Most popular search terms and skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <TrendingKeywordsChart data={data?.trendingKeywords} />
                  )}
                </CardContent>
              </Card>

              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Most Popular Industries</CardTitle>
                  <CardDescription>
                    Distribution of jobs across top industries
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <IndustryJobsChart data={data?.popularIndustries} />
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="py-6">
              <CardHeader>
                <CardTitle>Most Active Users</CardTitle>
                <CardDescription>
                  Users with the highest engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <MostActiveUsersTable users={data?.mostActiveUsers} />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPresentation;
