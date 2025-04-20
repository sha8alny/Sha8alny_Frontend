
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
  import { InappropriateContentReportModal } from "./InappropriateContentReportModal";
  import EditCalendarIcon from "@mui/icons-material/EditCalendar";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/app/components/ui/Select";
  
  import TableSkeleton from "./TableSkeleton";
import { User } from "lucide-react";
  
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
   * @param {Array} props.reports - The list of flagged job reports to display.
   * @param {boolean} props.isDialogOpen - Indicates whether the details dialog is open.
   * @param {Object} props.selectedReport - The currently selected report for viewing details.
   * @param {Function} props.handleViewDetails - Function to handle viewing details of a report.
   * @param {Function} props.handleCloseDialog - Function to handle closing the details dialog.
   * @param {Function} props.handleDeleteReport - Function to handle deleting a report.
   * @param {Function} props.handleDeleteItem - Function to handle deleting a job.
   * @param {Function} props.handleUpdateReport - Function to handle updating the status of a report.
   * @param {number} props.page - The current page number for pagination.
   * @param {Function} props.setPage - Function to set the current page number.
   * @param {boolean} props.isFetching - Indicates whether data is being fetched.
   * @param {Array} props.statusOptions - The list of available status options for filtering.
   * @param {Function} props.toggleTypesFilter - Function to toggle the selected status filter.
   * @param {Array} props.selectedStatuses - The list of currently selected statuses for filtering.
   * @param {Function} props.getStatusColor - Function to get the color class for a status badge.
   * @param {string} props.sortOrder - The current sort order ("asc" or "des").
   * @param {Function} props.setSortOrder - Function to set the sort order.
   * @param {boolean} props.isLoading - Indicates whether the data is loading.
   * @param {boolean} props.isError - Indicates whether there was an error loading the data.
   */
  
  export function InappropriateContentReportsPresentation({
    reports,
    filters,
    handleFilterChange,
    isDialogOpen,
    selectedReport,
    handleViewDetails,
    handleCloseDialog,
    handleDeleteUser,
    handleDeletePost,
    handleDeleteComment,
    handleDeleteReport,
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
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full md:w-[180px] bg-transparent text-secondary rounded-md border border-text cursor-pointer">
              Select Type
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleFilterChange("all")}
                className={filters.includes("all") ? "bg-secondary text-white" : ""}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("users")}
                className={filters.includes("users") ? "bg-secondary text-white" : ""}
              >
                Users
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("posts")}
                className={filters.includes("posts") ? "bg-secondary text-white" : ""}
              >
                Posts
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("comments")}
                className={filters.includes("comments") ? "bg-secondary text-white" : ""}
              >
                Comments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="des">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        <div className="rounded-md border text-text">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reported User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Report Date</TableHead>
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
              ) : (
                reports.data.map((report) => {
                  let id=""
                  let avatarSrc=""
                  let type = ""
                  if (report.profilePicture){
                     id = report.userId
                      avatarSrc = report.profilePicture
                      type = "User"
                  }else if(report.keywords){
                      id = report.postId
                      avatarSrc = "https://th.bing.com/th/id/OIP.epTD4rU3KFbzG4oT4WSbvwHaHa?rs=1&pid=ImgDetMain"
                      type = "Post"
                  }else{
                    id= report.commentId
                    avatarSrc ="https://static.vecteezy.com/system/resources/previews/026/183/918/non_2x/simple-comment-icon-isolated-on-white-background-vector.jpg"
                    type = "Comment"
                  }
                  return (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={avatarSrc}
                            alt={report.username}
                          />
                          <AvatarFallback>
                            {report.username}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{report.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-text border-secondary"
                      >
                        {type}
                      </Badge>
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
                          <button className="w-full flex items-center justify-center">
                            <MoreHorizIcon className="w-10" />
                            <span className="sr-only">Open menu</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(report)}
                          >
                            <VisibilityIcon className="mr-2" fontSize="small" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleUpdateReport(report._id, "approved");
                              if (type === "User") {
                                handleDeleteUser(report.userId);
                              } else if (type === "Post") {
                                handleDeletePost(report.postId);
                              } else if (type === "Comment") {
                                handleDeleteComment(report.commentId);
                              }
                            }}
                          >
                            <CheckCircleIcon className="mr-2" fontSize="small" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateReport(report._id, "rejected")
                            }
                          >
                            <DeleteIcon className="mr-2" fontSize="small" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateReport(report._id, "reviewing")
                            }
                          >
                            <EditCalendarIcon className="mr-2" fontSize="small" />
                            Set Status to Reviewing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  );
  })
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
            disabled={!reports.data?.nextPage || isFetching}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isFetching ? "Loading..." : "Next"}
          </button>
        </div>
  
        <InappropriateContentReportModal
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          report={selectedReport}
          type={selectedReport?.profilePicture ? "User" : selectedReport?.keywords ? "Post" : "Comment"}
        />
      </>
    );
  }
  