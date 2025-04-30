"use client";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import { Button } from "@/app/components/ui/Button";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../ui/AlertDialog";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Label } from "@/app/components/ui/Label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/app/components/ui/Select";
import { useEffect } from "react";

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
const JobsForm = ({
  jobs,
  isLoading,
  onShowPostJobForm,
  onShowApplicants,
  page,
  onNextPage,
  onPrevPage,
  hasMore,
  onDeleteJob,
  onEditJob,
  setUpdatedJob,
  isEditing,
    setOpenDialogForJobId,
    openDialogForJobId,
    isDeleting,
    setOpenDeleteDialogForId,
  openDeleteDialogForId,
  isError,
  onShowDeletedJobs,
  showDeletedJobs,
  onRestoreJob,
  isRestoring,
}) => {

  useEffect(() => {
    console.log("openDeleteDialogForId:", openDeleteDialogForId);
  }, [openDeleteDialogForId]);
  return (
    <div className="flex-grow items-center mx-auto w-full ">
      <section className="w-full p-8 bg-foreground rounded-lg shadow-xl grid grid-cols-2">
        <div>
          <h1 className="text-2xl text-semibold text-secondary">Jobs</h1>
          <p className="text-sm text-text">Manage your page's job posts</p>
        </div>
        <div className="flex justify-end">
          <Button
            data-testid="PostNewJob"
            onClick={onShowPostJobForm}
            className=" text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
          >
            Post new job
          </Button>
        </div>
      </section>
      <section className="flex-grow p-10 bg-foreground rounded-lg shadow-xl w-full mt-5 min-h-138 ">
        {!isLoading && (
        <div className="flex justify-between">
        <h1 className="text-3xl justify-center text-semibold text-secondary">
          Posted Jobs
        </h1>
        </div>
        )}
        <hr className="border-secondary  mt-4 mb-2" />
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 w-full justify-center">
            <button
                data-testid="current-button"
                onClick={()=>{onShowDeletedJobs(false);
                setOpenDeleteDialogForId(null);
                }}
                className={`w-full p-2 rounded-lg transition ${showDeletedJobs=== false ? "bg-secondary text-primary" : "bg-transparent text-primary hover:bg-secondary hover:text-white"}`}
            >
                Opened Jobs
            </button>
            <button
                data-testid="deleted-button"
                onClick={()=>{onShowDeletedJobs(true);
                setOpenDeleteDialogForId(null);
                }}
                className={`w-full p-2 rounded-lg transition ${showDeletedJobs ? "bg-secondary text-primary" : "bg-transparent text-primary hover:bg-secondary hover:text-white"}`}
            >
                Deleted Jobs
            </button>
        </div>
        {isError && (
          <div className="w-full flex flex-col justify-center items-center gap-2 h-full mt-50">
            <p className="text-red-500 text-lg">
              An error occurred while retieving the jobs. Please try again later.
            </p>
          </div>
        )}
        {isLoading ? (
          <div className="w-full flex flex-col justify-center items-center gap-2 h-full mt-50">
            <div className="size-12 border-2 border-t-transparent rounded-full animate-spin border-secondary" />
            <span className="text-primary">Loading...</span>{" "}
          </div>
        ) : jobs.length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center gap-2 h-full mt-25 mb-25">
          <img
            src="/man_on_chair_light.svg"
            alt="No connections"
            className="w-1/2 h-1/2 block dark:hidden"
          />

          <img
            src="/man_on_chair.svg"
            alt="No connections"
            className="w-1/2 h-1/2 hidden dark:block"
          />         
          <span className="text-primary">
          {showDeletedJobs ? "No Deleted Jobs Yet" : "No Posted Jobs Yet"}
          </span>{" "}
          {showDeletedJobs ? (
            <p className="text-text text-lg mt-4">
              Deleted jobs will be shown here.
            </p>
          ) : (
            <Button
              data-testid="firstJob-button"
              className="text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 mt-4"
              onClick={onShowPostJobForm}
            >
              Post new job
            </Button>
          )}
           </div>
          ) : (
          jobs.map((job, index) => (
            <form
              key={job._id || index}
              className=" bg-background flex-grow p-10 w-full rounded-lg mt-8 min-w-0 "
            >
              <div>
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <h1 className="text-secondary sm:text-2xl text-lg text-semibold break-words whitespace-normal overflow-hidden text-clip w-xs sm:w-sm lg:max-w-lg">
                    {job.title}
                  </h1>
                  <Button
                    data-testid="ShowApplicants"
                    type="button"
                    onClick={() => {
                      console.log("Job ID:", job._id);
                      onShowApplicants(job._id);
                    }}
                    className="mt-2 md:mt-0 text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 px-4 py-1 "
                  >
                    Show Applicants
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  <div>
                  <p className="text-text break-words whitespace-normal w-3xs">
                  {job.location}</p>
                    <p className="text-text break-words whitespace-normal w-3xs sm:max-w-xs xl:max-w-md w-full">{job.industry}</p>
                    <p className="text-secondary">{job.employmentType}</p>
                    <p className="text-secondary font-bold break-words whitespace-normal w-3xs">${job.salary}</p>
                  </div>
                  <div className="hidden lg:flex relative  items-center justify-center h-20">
                    <div className="w-[4px] h-17 bg-text"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-text w-3 h-3 rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-text w-3 h-3 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-text">{job.experience}</p>
                    <p className="text-secondary">{job.workLocation}</p>
                    <p className="text-secondary font-bold">
                      {new Date(showDeletedJobs? job.time: job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <hr className="p-3 space-y-4 " />
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                  <div className="relative flex flex-col items-center group cursor-pointer">
                    <RemoveRedEyeOutlined className="text-secondary" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-secondary text-sm">
                      {" "}
                      views:
                      <p className="text-text text-semibold text-sm text-center font-bold">
                        {job.numViews}{" "}
                      </p>
                    </span>
                  </div>
                  
                  <div>
                  {!showDeletedJobs && (
                    <AlertDialog open={openDialogForJobId === job._id}>
                      <AlertDialogTrigger asChild>
                        <div
                          data-testid="EditJob"
                          className="relative flex flex-col items-center group cursor-pointer"
                          onClick={() => setOpenDialogForJobId(job._id)}
                        >
                          <EditIcon className="text-secondary" />
                          <span className="absolute top-8 text-sm text-secondary bg-none p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Edit Job
                          </span>
                        </div>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-secondary text-2xl">
                            Edit Posted Job
                          </AlertDialogTitle>
                        </AlertDialogHeader>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            onEditJob(job._id);
                          }}
                          className="grid gap-4 py-4"
                        >
                          <Label htmlFor="title" className="text-text text-lg">
                            Title
                          </Label>
                          <Input
                            data-testid="edit-title"
                            id="title"
                            defaultValue={job.title}
                            className={"text-text"}
                            onChange={(e) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />

                          <Label
                            htmlFor="location"
                            className="text-text text-lg"
                          >
                            Location
                          </Label>
                          <Input
                            data-testid="edit-location"
                            id="location"
                            defaultValue={job.location}
                            className={"text-text"}
                            onChange={(e) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                          />

                          <Label
                            htmlFor="workLocation"
                            className="text-text text-lg"
                          >
                            Work Location
                          </Label>
                          <Select
                            data-testid="edit-workLocation"
                            defaultValue={job.workLocation}
                            className={"text-text"}
                            onValueChange={(value) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                workLocation: value,
                              }))
                            }
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

                          <Label
                            htmlFor="employmentType"
                            className="text-text text-lg"
                          >
                            Employment Type
                          </Label>
                          <Select
                            data-testid="edit-employmentType"
                            defaultValue={job.employmentType}
                            className={"text-text"}
                            onValueChange={(value) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                employmentType: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full text-text">
                              <SelectValue placeholder="Select Employment Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">
                                Full-time
                              </SelectItem>
                              <SelectItem value="Part-time">
                                Part-time
                              </SelectItem>
                              <SelectItem value="Internship">
                                Internship
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Label
                            htmlFor="description"
                            className="text-text text-lg"
                          >
                            Description
                          </Label>
                          <Textarea
                            data-testid="edit-description"
                            id="description"
                            defaultValue={job.description}
                            className={"text-text"}
                            onChange={(e) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />

                          <Label
                            htmlFor="industry"
                            className="text-text text-lg"
                          >
                            Industry
                          </Label>
                          <Input
                            data-testid="edit-industry"
                            id="industry"
                            defaultValue={job.industry}
                            className={"text-text"}
                            onChange={(e) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                industry: e.target.value,
                              }))
                            }
                          />

                          <Label
                            htmlFor="experience"
                            className="text-text text-lg"
                          >
                            Experience
                          </Label>
                          <Select
                            data-testid="edit-experience"
                            defaultValue={job.experience}
                            className={"text-text"}
                            onValueChange={(value) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                experience: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full text-text">
                              <SelectValue placeholder="Select Experience Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Entry Level">
                                Entry Level
                              </SelectItem>
                              <SelectItem value="Mid Level">
                                Mid Level
                              </SelectItem>
                              <SelectItem value="Senior Level">
                                Senior Level
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Label htmlFor="salary" className="text-text text-lg">
                            Salary
                          </Label>
                          <Input
                            data-testid="edit-salary"
                            id="salary"
                            type="number"
                            className={"text-text"}
                            defaultValue={Math.round(job.salary)}
                            onChange={(e) =>
                              setUpdatedJob((prev) => ({
                                ...prev,
                                salary: Number(e.target.value),
                              }))
                            }
                          />

                          <AlertDialogFooter>
                            <AlertDialogCancel
                              data-testid="cancel-edit"
                              type="button"
                              className=" bg-foreground rounded-2xl font-semibold cursor-pointer hover:bg-primary/70 dark:bg-foreground dark:hover:bg-red-300 hover:text-background text-text"
                                onClick={() => setOpenDialogForJobId(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <button
                              data-testid="save-edit"
                              type="submit"
                              disabled={isEditing}
                              className={
                                "flex-1 rounded-2xl bg-secondary hover:bg-secondary/80 font-semibold text-primary-foreground"
                              }
                            >
                             {isEditing? "Saving..." : "Save"}{" "}
                            </button>
                          </AlertDialogFooter>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  </div>
                  <div>
                    <AlertDialog open={openDeleteDialogForId ===(showDeletedJobs ? job.jobId : job._id)}>
                      <AlertDialogTrigger asChild>
                        <div
                          data-testid="DeleteJob"
                          className="relative flex flex-col items-center group cursor-pointer"
                            onClick={() => setOpenDeleteDialogForId(showDeletedJobs ? job.jobId : job._id)}
                        > 
                          {showDeletedJobs ? (
                            <RestoreFromTrashIcon className="text-secondary" />
                          ) : (
                          <DeleteIcon className="text-secondary" />
                          )}
                          <span className="absolute top-8 text-sm text-secondary bg-none p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {showDeletedJobs
                              ? "Restore Job"
                              : "Delete Job"}
                          </span>
                        </div>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-secondary">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {showDeletedJobs
                              ? "This job will be restored and will be visible to applicants again."
                              : "This job will be currently deleted but not permanently removed. You can restore it later if you wish."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className=" bg-foreground rounded-2xl font-semibold cursor-pointer hover:bg-primary/70 dark:bg-foreground dark:hover:bg-red-300 hover:text-background text-text" onClick={() => setOpenDeleteDialogForId(null)}
                            data-testid="cancel-delete">
                            Cancel
                          </AlertDialogCancel>
                          {showDeletedJobs ? (
                            <button
                              data-testid="restore-job"
                              onClick={() => onRestoreJob(job.jobId)}
                              disabled={isRestoring}
                              className="bg-secondary rounded-2xl text-background hover:bg-secondary/80 text-sm font-semibold p-2"
                            >
                              {isRestoring ? "Restoring..." : "Restore Job"}
                            </button>
                          ) : (
                          <button
                            data-testid="confirm-delete"
                            onClick={() => onDeleteJob(job._id)}
                            disabled={isDeleting}
                            className="bg-secondary rounded-2xl text-background hover:bg-secondary/80 text-sm font-semibold p-2"
                          >
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                            
                          </button>
                          )}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </form>
          ))
        )}
      </section>
      {jobs.length > 0 && (
      <div className="flex justify-between items-center mt-4">
        <Button
          data-testid="prev-page"
          aria-label="Previous"
          onClick={onPrevPage}
          disabled={page === 1}
          className={`border border-secondary rounded-full px-2 py-2 ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ArrowBackIos />
        </Button>
        <p className="text-text">Page {page}</p>
        <Button
         data-testid="next-page"
          aria-label="Next"
          onClick={onNextPage}
          disabled={!hasMore}
          className={`border border-secondary rounded-full px-2 py-2 ${
            !hasMore ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ArrowForwardIos />
        </Button>
      </div>
      )}
    </div>
  );
};
export default JobsForm;
