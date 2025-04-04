"use client";
/**
 * @namespace admin
 * @module admin
 */
/**
 * FlaggedJobModal component displays the details of a flagged job in a modal.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.onClose - Function to call when the modal is closed.
 * @param {Object} props.report - The report data containing details of the flagged job.
 * @param {Object} props.report.job - The job data.
 * @param {string} props.report.job.title - The title of the job.
 * @param {Object} props.report.companyData - The company data.
 * @param {string} props.report.companyData.logo - The URL of the company's logo.
 * @param {string} props.report.companyData.name - The name of the company.
 * @param {string} props.report.job.location - The location of the job.
 * @param {string} props.report.job.work_location - The work location type (e.g., remote, on-site).
 * @param {string} props.report.job.employment_type - The employment type (e.g., full-time, part-time).
 * @param {Object} props.report.user - The user who flagged the job.
 * @param {string} props.report.user.username - The username of the user who flagged the job.
 * @param {string} props.report.createdAt - The date when the job was flagged.
 * @param {string} props.report.text - The reason for flagging the job.
 */

export function FlaggedJobModal({ isOpen, onClose, report }) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-text">
      <div className="bg-foreground p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">Flagged Job Details</h2>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <img
              src={report.companyData.logo}
              alt={report.companyData.name}
              className="h-14 w-14 rounded-full"
            />
            <div>
              <h3 className="font-bold text-lg">{report.title}</h3>
              <p className="text-sm text-gray-500">
                {report.companyData.name}
              </p>
            </div>
          </div>

          <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
            <h3 className="font-semibold text-red-700">Flag Information</h3>
            <p>
              <strong>Location:</strong> {report.location} (
              {report.workLocation})
            </p>
            <p>
              <strong>Employment Type:</strong> {report.employmentType}
            </p>
            <p>
              <strong>Flagged By:</strong> {report.accountName}
            </p>
            <p>
              <strong>Flagged Date:</strong>{" "}
              {new Date(report.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Flag Reason:</strong> {report.text}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-transparent text-secondary px-4 py-2 rounded-md border cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
