
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
  import RestoreIcon from '@mui/icons-material/Restore';
  import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
/**
 * InappropriateContentReportsPresentation component displays a list of inappropriate content reports
 * and provides functionality for filtering, pagination, and managing reports.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.reports - The list of inappropriate content reports to display.
 * @param {Array} props.filters - The list of available filters for report types (e.g., "User", "Post").
 * @param {Function} props.handleFilterChange - Function to handle changes in the selected filters.
 * @param {boolean} props.isDialogOpen - Indicates whether the details dialog is open.
 * @param {Object} props.selectedReport - The currently selected report for viewing details.
 * @param {Function} props.handleViewDetails - Function to handle viewing details of a report.
 * @param {Function} props.handleCloseDialog - Function to handle closing the details dialog.
 * @param {Function} props.handleDeleteReport - Function to handle deleting a report.
 * @param {Function} props.handleDeleteItem - Function to handle deleting an item (e.g., a job, post, or user).
 * @param {Function} props.handleUpdateReport - Function to handle updating the status of a report.
 * @param {number} props.page - The current page number for pagination.
 * @param {Function} props.setPage - Function to set the current page number.
 * @param {boolean} props.isFetching - Indicates whether data is being fetched.
 * @param {Array} props.statusOptions - The list of available status options for filtering.
 * @param {Function} props.toggleTypesFilter - Function to toggle the selected type filter.
 * @param {Array} props.selectedStatuses - The list of currently selected statuses for filtering.
 * @param {Function} props.getStatusColor - Function to get the color class for a status badge.
 * @param {string} props.sortOrder - The current sort order ("asc" or "desc").
 * @param {Function} props.setSortOrder - Function to set the sort order.
 * @param {boolean} props.isLoading - Indicates whether the data is loading.
 * @param {boolean} props.isError - Indicates whether there was an error loading the data.
 *
 * @returns {JSX.Element} The presentation component for inappropriate content reports.
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
    handleDeleteCompany,
    handleReactivateContent,
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
    openConfirmationDialog,
    setOpenConfirmationDialog,
  }) {
    return (
      <>
        <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">     
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                data-testid={`status-filter-${status.toLowerCase()}`}
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
            <DropdownMenuTrigger className="w-full md:w-[180px] bg-transparent text-secondary rounded-md border border-text cursor-pointer" 
            data-testid="filter-dropdown"
            >
              Select Type
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                data-testid="all-filter"
                onClick={() => handleFilterChange("all")}
                className={filters.includes("all") ? "bg-secondary text-white rounded-none" : ""}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="user-filter"
                onClick={() => handleFilterChange("User")}
                className={filters.includes("User") ? "bg-secondary text-white rounded-none" : ""}
              >
                Users
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="company-filter"
                onClick={() => handleFilterChange("Company")}
                className={filters.includes("Company") ? "bg-secondary text-white rounded-none" : ""}
              >
                Companies
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="post-filter"
                onClick={() => handleFilterChange("Post")}
                className={filters.includes("Post") ? "bg-secondary text-white rounded-none" : ""}
              >
                Posts
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="comment-filter"
                onClick={() => handleFilterChange("Comment")}
                className={filters.includes("Comment") ? "bg-secondary text-white rounded-none" : ""}
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
              <SelectItem value="asc"
              data-testid="sort-asc"
              >Ascending</SelectItem>
              <SelectItem value="des"
              data-testid="sort-des"
              >Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-screen">
        <div className="rounded-md border text-text">
          <Table>
          {(reports.data && reports.data.length > 0)&&(  
            <TableHeader>
              <TableRow>
                <TableHead>Reported User/Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          )}
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : isError ? (
                <div className="p-8 text-center border border-dashed border-yellow-600  rounded-md">
                <ReportProblemOutlinedIcon className="text-yellow-600 mb-2" style={{ fontSize: '3rem' }} />
                <h3 className="text-yellow-600 text-lg font-medium mb-2">No Reports Issued At The Moment</h3>
                <p className="text-gray-600">
                   Please try again later.
                </p>
              </div>
              ) : (
                reports.data.map((report) => {
                  let avatarSrc=""
                  let type = report.reportData.type;
                  let name =""
                  let id = report.itemDetails._id
                  if (type === "User") {
                      avatarSrc = report.itemDetails.profilePicture
                      name = report.itemDetails.name
                  }else if(type === "Company"){
                      avatarSrc = report.itemDetails.logo
                      name = report.itemDetails.name
                  }else if(type === "Post" && report.itemDetails.type === "Company"){
                    avatarSrc = "https://cdn-icons-png.flaticon.com/512/1465/1465438.png"
                    name = report.itemDetails.companyData.name
                  }else if(type === "Post" && report.itemDetails.type === "User"){
                    avatarSrc = "https://th.bing.com/th/id/OIP.epTD4rU3KFbzG4oT4WSbvwHaHa?rs=1&pid=ImgDetMain"
                    name = report.itemDetails.userData.name
                  }else{
                    avatarSrc ="https://static.vecteezy.com/system/resources/previews/026/183/918/non_2x/simple-comment-icon-isolated-on-white-background-vector.jpg"
                    name = report.itemDetails.userData.name 
                  }
                  return (
                  <TableRow key={`${report.reportData._id}-${report.itemDetails._id}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={avatarSrc}
                            alt={name}
                          />
                          <AvatarFallback>
                            {name.charAt(0)} 
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {(report.reportData.status === "pending" && !report.itemDetails.isDeleted)?(
                            <a
                              href={
                                 type === "User"
                                ? `/u/${report.itemDetails.username}`
                                : type === "Company"
                                ? `/company/${report.itemDetails?.username}/user`
                                : type === "Post"
                                ? report.itemDetails?.userData?.username
                                  ? `/u/${report.itemDetails.userData.username}/post/${report.itemDetails._id}`
                                  : `/company/${report.itemDetails?.companyData?.username}/admin/posts`
                                : `/u/${report.itemDetails?.userData?.username}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:text-secondary hover:underline flex items-center"
                              data-testid={`view-${type.toLowerCase()}-profile`}
                            >
                          {name}</a>
                          ):(
                            <div className="font-mediumr">{name}</div>
                          )}
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
                        className={getStatusColor(report.reportData.status)}
                      >
                        {report.reportData.status.charAt(0).toUpperCase() + report.reportData.status.slice(1)}
                        </Badge>
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={report.reportData.profilePicture}
                            alt={report.reportData.username}
                          />
                          <AvatarFallback>
                            {report.reportData.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{report.reportData.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(report.reportData.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex items-center justify-center"
                            data-testid="dropdown-menu-trigger">
                            <MoreHorizIcon className="w-10" />
                            <span className="sr-only">Open menu</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-testid="view-details"
                            onClick={() => handleViewDetails(report)}
                          >
                            <VisibilityIcon className="mr-2" fontSize="small" />
                            View Details
                          </DropdownMenuItem>
                          {(report.reportData.status === "pending" && !report.itemDetails.isDeleted)&& (
                          <AlertDialog open={openConfirmationDialog=== report.reportData._id}   onOpenChange={(isOpen) =>
                              setOpenConfirmationDialog(isOpen ? report.reportData._id : null)
                            }>
                            <AlertDialogTrigger asChild>
                              <div>
                          <DropdownMenuItem
                          data-testid="approve-report"
                          onSelect={(e) => e.preventDefault()}
                          >
                            <CheckCircleIcon className="mr-2" fontSize="small" />
                            Approve
                          </DropdownMenuItem>
                          </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-secondary">Are You Sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This Will Approve The Report And Remove This {type} From The System, but You Can {type === "User" ? "Unban The User" : type === "Company" ? "Reactivate The Company" : type === "Post" ? "Restore The Post" : "Restore The Comment"} Later if needed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                data-testid="cancel-approve"
                               className=" bg-foreground rounded-2xl font-semibold cursor-pointer hover:bg-primary/70 dark:bg-foreground dark:hover:bg-red-300 hover:text-background text-text" 
                               onClick={() => setOpenConfirmationDialog(null)}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <button
                                data-testid="confirm-approve"
                                onClick={() => {
                                  handleUpdateReport(report.reportData._id, "resolved");
                                  if (type === "User") {
                                    handleDeleteUser(id);
                                  } else if (type === "Company") {
                                    handleDeleteCompany(id);
                                  } else if (type === "Post") {
                                    handleDeletePost(id);
                                  } else if (type === "Comment") {
                                    handleDeleteComment(id);
                                  }
                                }}
                                className="bg-secondary rounded-2xl text-background hover:bg-secondary/80 text-sm font-semibold p-2"
                                >
                                  Approve
                                </button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          )}
                          {(report.reportData.status === "pending" && !report.itemDetails.isDeleted) && (
                          <DropdownMenuItem
                            data-testid="reject-report"
                            onClick={() =>
                              handleUpdateReport(report.reportData._id, "rejected")
                            }
                          >
                            <DeleteIcon className="mr-2" fontSize="small" />
                            Reject
                          </DropdownMenuItem>
                          )}
                          {(report.reportData.status === "resolved" || report.reportData.status === "pending") && report.itemDetails.isDeleted && (
                          <DropdownMenuItem
                            data-testid="reactivate-content"
                            onClick={() =>{
                              handleReactivateContent(type,report.itemDetails._id)
                
                            }}
                          >
                            <RestoreIcon className="mr-2" fontSize="small" />
                            {type === "User" ? "Unban User" : type === "Company" ? "Reactivate Company" : type === "Post" ? "Restore Post" : "Restore Comment"}
                          </DropdownMenuItem>
                          )}

                          {/* <DropdownMenuItem
                            onClick={() =>
                              handleUpdateReport(report._id, "reviewing")
                            }
                          >
                            <EditCalendarIcon className="mr-2" fontSize="small" />
                            Set Status to Reviewing
                          </DropdownMenuItem> */}
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
        {(reports.data && reports.data.length > 0) && (
        <div className="flex justify-between mt-4">
          <button
            data-testid="previous-page"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            data-testid="next-page"
            disabled={!reports?.nextPage || isFetching}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-transparent text-secondary rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isFetching ? "Loading..." : "Next"}
          </button>
        </div>
        )}
        </div>
  
        <InappropriateContentReportModal
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          report={selectedReport}
          type={selectedReport?.reportData?.type? "User" : selectedReport?.reportData?.type? "Company":selectedReport?.reportData?.type? "Post" : "Comment"}
        />
      </>
    );
  }
  