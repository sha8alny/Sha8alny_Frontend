import Container from "@/app/components/layout/Container";
import { Card,CardContent } from "@/app/components/ui/Card";

/**
 * @namespace CompanyJobs
 * @description Namespace for components and types related to displaying company job listings.
 */

/**
 * CompanyJobs component - Displays a list of job postings for a company.
 * 
 * @memberof CompanyJobs
 * @param {Object[]} jobs - An array of job objects to be displayed.
 * @param {string} jobs[].title - The title of the job.
 * @param {string} jobs[].companyData.logo - The company logo URL.
 * @param {string} jobs[].companyData.name - The name of the company posting the job.
 * @param {string} jobs[].location - The job location.
 * @param {string} jobs[].createdAt - The job posting date.
 * @param {string} jobs[].jobType - The type of the job (used for conditional card layout).
 * @returns {JSX.Element} The rendered component with job listings.
 */

export default function CompanyJobs({jobs=[], goToJobPage}){
    const getRelativeTimeString = (date) => {
        try {
          if (!date) return "Recently";
      
          const now = new Date();
          const past = new Date(date);
          const diffTime = Math.abs(now - past);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
          if (diffDays === 0) return "Today";
          if (diffDays === 1) return "Yesterday";
          if (diffDays < 7) return `${diffDays} days ago`;
          if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
          return `${Math.floor(diffDays / 30)} months ago`;
        } catch {
          return "Recently";
        }
    };

    if(!jobs.length){
        return (
            <div className="text-center py-6 text-text">
              No jobs available at the moment.
            </div>
          );
    }
    
    return (
        <div>
            <Container className="p-6">
                <h2 className="text-text text-2xl font-bold mb-4">Posted Jobs</h2>
                <div className="flex flex-wrap gap-6">
                    {jobs.map((job, index) => (
                        <Card key={job.id || index} className="w-60 rounded-xl bg-foreground">
                            <CardContent className="flex flex-col pt-12 pl-6 pb-6">
                                <img
                                    src={job?.companyData.logo || "/placeholder.svg"}
                                    alt="Profile picture"
                                    className="w-30 h-30 rounded-lg -mt-10"
                                />
                                <h3 className="mt-2 font-semibold text-xl cursor-pointer hover:underline transition-all duration-150" onClick={() => goToJobPage(job)}>{job.title}</h3>
                                <p className="text-text text mb-1">{job.companyData.name}</p>
                                <p className="text-muted-foreground text-sm mb-1">{job.location}</p>
                                <p className="text-muted-foreground text-sm mb-1">
                                    {getRelativeTimeString(job.createdAt)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    );
}
