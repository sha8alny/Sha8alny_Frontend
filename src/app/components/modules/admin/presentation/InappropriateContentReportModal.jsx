"use client";
/**
 * @namespace admin
 * @module admin
 */
/**
 * InappropriateContentReportModal component displays the details of a flagged job in a modal.
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

export function InappropriateContentReportModal({ isOpen, onClose, report, type }) {
  if (!isOpen || !report) return null;
  let contentType = "Comment";
  if (report.profilePicture) contentType = "User";
  else if (report.keywords) contentType = "Post";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-text">
      <div className="bg-foreground p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">Inapproptiate Content Details</h2>
        </div>

        {contentType === "User" && (
        <div className="mt-4">
        <div className="flex items-center space-x-3">
        <img
            src={report.profilePicture}
            alt={report.name}
            className="h-14 w-14 rounded-full"
        />
        <div>
            <h3 className="font-bold text-lg">{report.name}</h3>
            <p className="text-sm text-gray-500">
            {report.headline}
            </p>
        </div>
        </div>

        <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
        <h3 className="font-semibold text-red-700">Report Information</h3>
        <p>
            <strong>Email:</strong> {report.email}
        </p>
        <p>
            <strong>Account Visibility:</strong> {report.visibility}
        </p>
        <p>
            <strong>About:</strong> {report.about}
        </p>
        <p>
            <strong>Location:</strong> {report.location}
        </p>
        <p>
            <strong>Experience:</strong> {report.experienceIds?.length ? report.experienceIds.join(", ") : "None"}
        </p>
        <p>
            <strong>Education:</strong> {report.educationIds?.length ? report.educationIds.join(", ") : "None"}
        </p>
        <p>
            <strong>Certificates:</strong> {report.certificateIds?.length ? report.certificateIds.join(", ") : "None"}
        </p>
        <p>
            <strong>Industry:</strong> {report.industry}
        </p>
        <p>
            <strong>Subscription PLan:</strong> {report.subscription}
        </p>
        <p>
            <strong>Saved Jobs:</strong> {report.savedJobs?.length ? report.savedJobs.join(", ") : "None"}
        </p>
        <p>
            <strong>Saved Posts:</strong> {report.savedPosts?.length ? report.savedPosts.join(", ") : "None"}
        </p>
        <p>
            <strong>User Type:</strong> {report.type}
        </p>
        <p>
            <strong>Resume:</strong> {""}
            <a
            href={report.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:underline"
            >
            {report.resume}
            </a>
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
        )}
        {contentType === "Post" && (
        <div className="mt-4">
        <div className="flex items-center space-x-3">
            {report.media ? (
            <img
                src={report.media}
                alt={report.accountName}
                className="h-14 w-14 rounded-full"
            />
            ):(
                <img 
                src= "https://th.bing.com/th/id/OIP.epTD4rU3KFbzG4oT4WSbvwHaHa?rs=1&pid=ImgDetMain"
                alt={report.accountName}
                className="h-14 w-14 rounded-full"
                />
            )}
        <div>
            <h3 className="font-bold text-lg">{report.username}</h3>
        </div>
        </div>
        <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
        <h3 className="font-semibold text-red-700">Report Information</h3>
        <p>
            <strong>Post Tags:</strong> {report.tags?.length ? report.tags.join(", ") : "None"}
        </p>
        <p>
            <strong>Post Likes:</strong> {report.likes?.length ? report.likes.join(", ") : "None"}
        </p>
        <p>
            <strong>Post keywords:</strong> {report.keywords?.length ? report.keywords.join(", ") : "None"}
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
        )}
        {contentType === "Comment" && (
        <div className="mt-4">
            <div className="flex items-center space-x-3">
                <img
                src="https://static.vecteezy.com/system/resources/previews/026/183/918/non_2x/simple-comment-icon-isolated-on-white-background-vector.jpg"
                alt={report.username}
                className="h-14 w-14 rounded-full"
                />
                <div>
                    <h3 className="font-bold text-lg">{report.username}</h3>
                 </div>
            </div>
            <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
                <h3 className="font-semibold text-red-700">Report Information</h3>
                <p>
                    <strong>Comment Likes:</strong> {report.likes?.length ? report.likes.join(", ") : "None"}
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
        )}

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
