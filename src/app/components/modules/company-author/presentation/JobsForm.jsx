"use client";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";

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
        <section className="flex-grow p-8 bg-transparent border border-secondary rounded-lg shadow-xl m-8 max-w-2xl mt-5 bottom-8 grid grid-cols-2">
        <div>
        <h1 className="text-2xl text-semibold text-secondary">Jobs</h1>
        <p className="text-sm text-text">Manage your page's 
            job posts
        </p>
        </div>
        <div className="flex justify-end">
            <button 
            onClick={onShowPostJobForm}
            className=" border border-secondary text-lg text-secondary rounded-full px-8 py-2 hover:bg-foreground transition duration-300 ">Post new job</button>

            </div>
        </section> 
        <section className="flex-grow p-10 bg-transparent border border-secondary rounded-lg shadow-xl m-8 max-w-2xl min-h-138 ">
        <h1 className="text-3xl justify-center text-semibold text-secondary">Posted Jobs</h1>
        <hr className="border-secondary  mt-4"/>
        {isLoading ?( <p className="text-text text-xl text-semibold">Loading...</p> ) : ( jobs.length === 0 ? (
            <p className="text-text text-xl text-semibold">No jobs posted yet</p> ) : (
                jobs.map((job,index) => (
        <form
            key={job.job_id || index}
          className=" bg-foreground flex-grow p-10 w-full rounded-lg border border-secondary  mt-8  ">
          <div>
            <div className="grid grid-cols-2 mb-4">
          <h1 className="text-secondary text-2xl text-semibold">{job.title}</h1>
          <button
            type="button"
            onClick={()=>
                {console.log("Job ID:", job.job_id); 
                onShowApplicants(job.job_id)}}
           className=" border border-secondary text-lg text-secondary rounded-full  hover:bg-background transition duration-300 ">Show Applicants</button>
          </div>
          <div className="grid grid-cols-3">
            <div>
            <p className="text-text">{job.location}</p>
            <p className="text-text">{job.industry}</p>
            <p className="text-secondary">{job.employmentType}</p>
            <p className="text-secondary font-bold">${job.salary}</p>
            </div>
            <div className="relative ml-8 flex items-center justify-center h-20"> 
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
          <div className="mt-2 grid grid-cols-2 gap-100">
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