"use client";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import { Button } from "@/app/components/ui/Button";
import { ArrowForwardIos,ArrowBackIos } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction
  } from "../../../ui/AlertDialog";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Label } from "@/app/components/ui/Label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/app/components/ui/Select";

/**
 * @namespace company-author
 * @module company-author
 */
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
const JobsForm = ({ jobs, isLoading, onShowPostJobForm, onShowApplicants, page, onNextPage, onPrevPage, hasMore, onDeleteJob,onEditJob, setUpdatedJob}) => {

    return(
        <div className="flex-grow items-center">
        <section className="w-full p-8 bg-foreground rounded-lg shadow-xl w-full grid grid-cols-2">
        <div>
        <h1 className="text-2xl text-semibold text-secondary">Jobs</h1>
        <p className="text-sm text-text">Manage your page's 
            job posts
        </p>
        </div>
        <div className="flex justify-end">
            <Button 
            onClick={onShowPostJobForm}
            className=" text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200">Post new job</Button>

            </div>
        </section> 
        <section className="flex-grow p-10 bg-foreground rounded-lg shadow-xl w-full mt-5 min-h-138 ">
        <h1 className="text-3xl justify-center text-semibold text-secondary">Posted Jobs</h1>
        <hr className="border-secondary  mt-4"/>
        {isLoading ?( <p className="text-text text-xl text-semibold">Loading...</p> ) : ( jobs.length === 0 ? (
            <p className="text-text text-xl text-semibold">No jobs posted yet</p> ) : (
                jobs.map((job,index) => (
        <form
            key={job._id || index}
          className=" bg-background flex-grow p-10 w-full rounded-lg mt-8  ">
          <div > 
            <div className="flex flex-col md:flex-row justify-between mb-6">
          <h1 className="text-secondary text-2xl text-semibold">{job.title}</h1>
          <Button
            type="button"
            onClick={()=>
                {console.log("Job ID:", job._id); 
                onShowApplicants(job._id)}}
           className="mt-2 md:mt-0 text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 px-4 py-1 ">Show Applicants</Button>
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
                <p className="text-secondary font-bold">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <hr className="p-3 space-y-4 "/>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
             <div className="relative flex flex-col items-center group cursor-pointer">
                    <RemoveRedEyeOutlined className="text-secondary" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-secondary text-sm"> views:<p className="text-text text-semibold text-sm text-center font-bold">{job.views} </p>
                    </span>
                </div>
                <div>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div  data-testid="EditJob" className="relative flex flex-col items-center group cursor-pointer">
                    <EditIcon className="text-secondary" />
                    <span className="absolute top-8 text-sm text-secondary bg-none p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit Job
                    </span>
                    </div>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-secondary text-2xl">Edit Posted Job</AlertDialogTitle>
                    </AlertDialogHeader>

                    <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onEditJob(job._id);
                    }}
                    className="grid gap-4 py-4"
                    >
                    <Label htmlFor="title" className="text-text text-lg">Title</Label>
                    <Input
                        id="title"
                        defaultValue={job.title}
                        className={"text-text"}
                        onChange={(e) => setUpdatedJob((prev) => ({ ...prev, title: e.target.value }))}
                    />

                    <Label htmlFor="location" className="text-text text-lg">Location</Label>
                    <Input
                        id="location"
                        defaultValue={job.location}
                        className={"text-text"}
                        onChange={(e) => setUpdatedJob((prev) => ({ ...prev, location: e.target.value }))}
                    />

                    <Label htmlFor="workLocation" className="text-text text-lg">Work Location</Label>
                    <Select
                        defaultValue={job.workLocation}
                        className={"text-text"}
                        onValueChange={(value) => setUpdatedJob((prev) => ({ ...prev, workLocation: value }))}
                    >
                        <SelectTrigger className="w-full text-text">
                        <SelectValue placeholder="Select Work Location" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="employmentType" className="text-text text-lg">Employment Type</Label>
                    <Select
                        defaultValue={job.employmentType}
                        className={"text-text"}
                        onValueChange={(value) => setUpdatedJob((prev) => ({ ...prev, employmentType: value }))}
                    >
                        <SelectTrigger className="w-full text-text">
                        <SelectValue placeholder="Select Employment Type" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="description" className="text-text text-lg">Description</Label>
                    <Textarea
                        id="description"
                        defaultValue={job.description}
                        className={"text-text"}
                        onChange={(e) => setUpdatedJob((prev) => ({ ...prev, description: e.target.value }))}
                    />

                    <Label htmlFor="industry" className="text-text text-lg">Industry</Label>
                    <Input
                        id="industry"
                        defaultValue={job.industry}
                        className={"text-text"}
                        onChange={(e) => setUpdatedJob((prev) => ({ ...prev, industry: e.target.value }))}
                    />

                    <Label htmlFor="experience" className="text-text text-lg">Experience</Label>
                    <Select
                        defaultValue={job.experience}
                        className={"text-text"}
                        onValueChange={(value) => setUpdatedJob((prev) => ({ ...prev, experience: value }))}
                    >
                        <SelectTrigger className="w-full text-text">
                        <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="salary" className="text-text text-lg">Salary</Label>
                    <Input
                        id="salary"
                        type="number"
                        className={"text-text"}
                        defaultValue={job.salary}
                        onChange={(e) => setUpdatedJob((prev) => ({ ...prev, salary: Number(e.target.value) }))}
                    />

                    <AlertDialogFooter>
                        <AlertDialogCancel type="button" className="flex-1 bg-red-700 rounded-2xl font-semibold cursor-pointer hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300 hover:text-background text-primary-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit" className={"flex-1 rounded-2xl bg-secondary hover:bg-secondary/80 font-semibold text-primary-foreground"}>Save</AlertDialogAction>
                    </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
                </AlertDialog>

                </div>
                <div>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div data-testid="DeleteJob" className="relative flex flex-col items-center group cursor-pointer">
                    <DeleteIcon className="text-secondary" />
                    <span className="absolute top-8 text-sm text-secondary bg-none p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Delete Job
                    </span>
                    </div>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-secondary">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this job posting.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel className=" bg-foreground rounded-2xl font-semibold cursor-pointer hover:bg-primary/70 dark:bg-foreground dark:hover:bg-red-300 hover:text-background text-text">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteJob(job._id)} className="bg-red-600 rounded-2xl text-white hover:bg-red-700">
                        Confirm Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
                </div>
          </div>
 
          </div>

        </form>
                ))
            )
        )}

        </section>
        <div className="flex justify-between items-center mt-4">
            <Button
                aria-label="Previous"
                onClick={onPrevPage}
                disabled={page === 1}
                className={`border border-secondary rounded-full px-2 py-2 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <ArrowBackIos />
            </Button>
            <p className="text-text">Page {page}</p>
            <Button
                aria-label="Next"
                onClick={onNextPage}
                disabled={!hasMore}
                className={`border border-secondary rounded-full px-2 py-2 ${!hasMore ? "opacity-50 cursor-not-allowed" : ""}`}>
                <ArrowForwardIos />
            </Button>
        </div>
        </div>
    );
};
export default JobsForm;