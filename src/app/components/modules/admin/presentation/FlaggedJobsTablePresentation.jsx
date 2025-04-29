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
import { Badge } from "@/app/components/ui/Badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FlaggedJobModal } from "./FlaggedJobModal";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";

import TableSkeleton from "./TableSkeleton";

/**
 * @namespace admin
 * @module admin
 */
/**
 * FlaggedJobsTablePresentation Component
 *
 * This component renders a table displaying flagged job reports with various actions and filters.
 * It includes functionality for sorting, filtering by status, pagination, and handling actions
 * such as viewing details, approving, rejecting, or setting the status of a report.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.reports - The object containing report data and pagination info.
 * @param {Array} props.reports.data - The list of flagged job reports to display.
 * @param {boolean} props.isDialogOpen - Indicates whether the details dialog is open.
 * @param {Object} props.selectedReport - The currently selected report for viewing details.
 * @param {Function} props.handleViewDetails - Function to handle viewing details of a report.
 * @param {Function} props.handleCloseDialog - Function to handle closing the details dialog.
 * @param {Function} props.handleDeleteReport - Function to handle deleting a report.
 * @param {Function} props.handleDeleteJob - Function to handle deleting a job.
 * @param {Function} props.handleUpdateReport - Function to handle updating the status of a report.
 * @param {number} props.page - The current page number for pagination.
 * @param {Function} props.setPage - Function to set the current page number.
 * @param {boolean} props.isFetching - Indicates whether data is being fetched.
 * @param {Array} props.statusOptions - The list of available status options for filtering.
 * @param {Function} props.toggleStatusFilter - Function to toggle the selected status filter.
 * @param {Array} props.selectedStatuses - The list of currently selected statuses for filtering.
 * @param {Function} props.getStatusColor - Function to get the color class for a status badge.
 * @param {string} props.sortOrder - The current sort order ("asc" or "des").
 * @param {Function} props.setSortOrder - Function to set the sort order.
 * @param {boolean} props.isLoading - Indicates whether the data is loading.
 * @param {boolean} props.isError - Indicates whether there was an error loading the data.
 */

export function FlaggedJobsTablePresentation({
  reports,
  isDialogOpen,
  selectedReport,
  handleViewDetails,
  handleCloseDialog,
  handleDeleteReport,
  handleDeleteJob,
  handleUpdateReport,
  page,
  setPage,
  isFetching,
  statusOptions,
  toggleStatusFilter,
  selectedStatuses,
  getStatusColor,
  sortOrder,
  setSortOrder,
  isLoading,
  isError,
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              data-testid={`flagged-jobs-${status.toLowerCase()}`}
              onClick={() => toggleStatusFilter(status)}
              className={`text-sm px-2 py-0.5 rounded-md border text-secondary cursor-pointer transition-all duration-200 ${
                selectedStatuses.includes(status)
                  ? "bg-secondary text-white border-secondary"
                  : "bg-transparent text-gray-800 border-gray-600 dark:border-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue
              data-testid="flagged-jobs-sort-time-select"
              placeholder="Sort by time"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem data-testid="flagged-jobs-sort-asc" value="asc">
              Ascending
            </SelectItem>
            <SelectItem data-testid="flagged-jobs-sort-des" value="des">
              Descending
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-screen">
        <div className="rounded-md border text-text">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flagged By</TableHead>
                <TableHead>Flagged Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">
                    Failed to load reports.
                  </TableCell>
                </TableRow>
              ) : reports.data && reports.data.length > 0 ? (
                reports.data.map((report) => (
                  <TableRow key={report.jobId}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={report.companyData.logo}
                            alt={report.companyData.name}
                          />
                          <AvatarFallback>
                            {report.companyData.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.companyData.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(report.status)}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.accountName}</TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            data-testid="dropdown-flagged-jobs"
                            className="w-full flex items-center justify-center"
                          >
                            <MoreHorizIcon className="w-10" />
                            <span className="sr-only">Open menu</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-testid="view-details-flagged-jobs"
                            onClick={() => handleViewDetails(report)}
                          >
                            <VisibilityIcon className="mr-2" fontSize="small" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid="job-approve"
                            onClick={() => {
                              handleUpdateReport(report._id, "approved");
                              handleDeleteJob(report.jobId);
                            }}
                          >
                            <CheckCircleIcon
                              className="mr-2"
                              fontSize="small"
                            />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid="job-reject"
                            onClick={() =>
                              handleUpdateReport(report._id, "rejected")
                            }
                          >
                            <DeleteIcon className="mr-2" fontSize="small" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid="job-review"
                            onClick={() =>
                              handleUpdateReport(report._id, "reviewing")
                            }
                          >
                            <EditCalendarIcon
                              className="mr-2"
                              fontSize="small"
                            />
                            Set Status to Reviewing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            data-testid="flagged-jobs-prev"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            data-testid="flagged-jobs-next"
            disabled={!reports.nextPage || isFetching}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isFetching ? "Loading..." : "Next"}
          </button>
        </div>
      </div>

      <FlaggedJobModal
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        report={selectedReport}
      />
    </>
  );
}