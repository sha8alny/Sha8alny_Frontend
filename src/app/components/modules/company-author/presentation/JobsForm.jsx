"use client";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import { Button } from "@/app/components/ui/Button";

/**
 * JobsForm component
 * 
 * This component renders a list of jobs. It displays a loading indicator while the jobs are being fetched.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {Array} props.jobs - The array of job objects to display.
 * @param {boolean} props.isLoading - The state indicating if the jobs are being fetched.
 * @param {Function} props.onShowPostJobForm - The function to call when the "Post new job" button is clicked.
 * @param {Function} props.onShowApplicants - The function to call when the "Show Applicants" button is clicked.
 * 
 * @example
 * return (
 *   <JobsForm
 *     jobs={jobs}
 *     isLoading={isLoading}
 *     onShowPostJobForm={onShowPostJobForm}
 *     onShowApplicants={onShowApplicants}
 *   />
 * )
 */
const JobsForm = ({ jobs, isLoading, onShowPostJobForm, onShowApplicants}) => {

    return(
        <div className="flex-grow">
        <section className="flex-grow p-8 bg-foreground rounded-lg shadow-xl m-8 max-w-2xl mt-5 bottom-8 grid grid-cols-2">
        <div>
        <h1 className="text-2xl text-semibold text-secondary">Jobs</h1>
        <p className="text-sm text-text">Manage your page's 
            job posts
        </p>
        </div>
        <div className="flex justify-end">
            <Button 
            onClick={onShowPostJobForm}
            className="  border border-secondary bg-secondary text-xl text-foreground rounded-full px-8 py-2 hover:bg-foreground hover:text-secondary transition duration-300">Post new job</Button>

            </div>
        </section> 
        <section className="flex-grow p-10 bg-foreground rounded-lg shadow-xl m-8 max-w-2xl min-h-138 ">
        <h1 className="text-3xl justify-center text-semibold text-secondary">Posted Jobs</h1>
        <hr className="border-secondary  mt-4"/>
        {isLoading ?( <p className="text-text text-xl text-semibold">Loading...</p> ) : ( jobs.length === 0 ? (
            <p className="text-text text-xl text-semibold">No jobs posted yet</p> ) : (
                jobs.map((job,index) => (
        <form
            key={job.job_id || index}
          className=" bg-background flex-grow p-10 w-full rounded-lg mt-8  ">
          <div > 
            <div className="flex flex-col md:flex-row justify-between mb-6">
          <h1 className="text-secondary text-2xl text-semibold">{job.title}</h1>
          <Button
            type="button"
            onClick={()=>
                {console.log("Job ID:", job.job_id); 
                onShowApplicants(job.job_id)}}
           className="mt-2 md:mt-0 border border-secondary text-md bg-secondary  text-foreground rounded-full  hover:bg-foreground hover:text-secondary transition duration-300 px-4 py-1 ">Show Applicants</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
            <p className="text-text">{job.location}</p>
            <p className="text-text">{job.industry}</p>
            <p className="text-secondary">{job.employmentType}</p>
            <p className="text-secondary font-bold">${job.salary}</p>
            </div>
            <div className="hidden lg:flex relative ml-8 flex items-center justify-center h-20"> 
            <div className="w-[4px] h-17 bg-text"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-text w-3 h-3 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-text w-3 h-3 rounded-full"></div>
            </div>
            <div>
                <p className="text-text">{job.experience}</p>
                <p className="text-secondary">{job.workLocation}</p>
                <p className="text-secondary font-bold">{new Date(job.time).toLocaleDateString()}</p>
            </div>
          </div>
          <hr className="p-3 space-y-4 "/>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 gap-8">
             <div className="relative flex flex-col items-center group cursor-pointer">
                    <RemoveRedEyeOutlined className="text-secondary" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-secondary text-sm"> views:<p className="text-text text-semibold text-sm text-center font-bold">{job.numViews} </p>
                    </span>
                </div>
             <div className="relative flex flex-col items-center group cursor-pointer">
             <ContactsOutlined className="text-secondary"/>
             <span className="absolute top-8 text-sm text-secondary bg-none p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opactity duration-300">
                Applicants:<p className="text-text text-semibold text-center font-bold">{job.numApplications} </p>
             </span>
             </div>
          </div>
 
          </div>

        </form>
                ))
            )
        )}
        </section>
        </div>
    );
};
export default JobsForm;