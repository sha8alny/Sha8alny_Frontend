"use client";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/Table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Delete } from "@mui/icons-material";

/**
 * @namespace admin
 * @module admin
 */
/**
 * JobsTablePresentation component , shows a table of jobs and options to manage a job post
 * @param {Object} props - Component props
 * @param {Array} props.jobs - List of job objects
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {Function} props.handleDeleteJob - Function to handle job deletion
 * @param {number} props.page - Current page number
 * @param {Function} props.setPage - Function to set page number
 * @param {boolean} props.isFetching - Fetching state
 * @param {Object} props.data - Data object containing job listings and pagination info
 */
export function JobsTablePresentation({
  jobs,
  isLoading,
  isError,
  handleDeleteJob,
  page,
  setPage,
  isFetching,
  data,
}) {


  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Work Location</TableHead>
              <TableHead>Employment Type</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading jobs...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  Failed to load jobs.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={job.companyData.logo}
                          alt={job.companyData.name}
                        />
                        <AvatarFallback>
                          {job.companyData.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.companyData.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.workLocation}</TableCell>
                  <TableCell>{job.employmentType}</TableCell>
                  <TableCell>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full flex items-center justify-center">
                          <MoreHorizIcon className="w-6" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          <Delete className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          disabled={!data?.nextPage || isFetching}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isFetching ? "Loading..." : "Next"}
        </button>
      </div>
    </>
  );
}
