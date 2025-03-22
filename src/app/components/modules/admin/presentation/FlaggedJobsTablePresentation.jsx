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
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
/**
 * FlaggedJobsTablePresentation component renders a table of flagged job reports with actions to view details, approve, or reject each report.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.reports - An object containing job reports data and pagination info.
 * @param {boolean} props.isDialogOpen - A boolean indicating if the details dialog is open.
 * @param {Object} props.selectedReport - The currently selected report for viewing details.
 * @param {Function} props.handleViewDetails - Function to handle viewing details of a report.
 * @param {Function} props.handleCloseDialog - Function to handle closing the details dialog.
 * @param {Function} props.handleDeleteReport - Function to handle rejecting a report.
 * @param {Function} props.handleDeleteJob - Function to handle approving a report.
 * @param {number} props.page - The current page number.
 * @param {Function} props.setPage - Function to set the current page number.
 * @param {boolean} props.isFetching - A boolean indicating if data is being fetched.
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
}) {
  return (
    <>
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
            {reports.data.map((report) => (
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
                  <Badge variant="outline" className="text-yellow-600">
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
                        onClick={() => handleDeleteJob(report.jobId)}
                      >
                        <CheckCircleIcon className="mr-2" fontSize="small" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteReport(report._id)}
                      >
                        <DeleteIcon className="mr-2" fontSize="small" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateReport(report._id, "Reviewing")}
                      >
                        <EditCalendarIcon className="mr-2" fontSize="small" />
                        Set Status to Reviewing
                      </DropdownMenuItem>
                     
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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

      <FlaggedJobModal
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        report={selectedReport}
      />
    </>
  );
}
