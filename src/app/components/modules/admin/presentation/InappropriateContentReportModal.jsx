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

export function InappropriateContentReportModal({ isOpen, onClose, report, kind }) {
  if (!isOpen || !report) return null;
    let avatarSrc = "";
    let name = "";
    let type = report.reportData.type;
    if (type === "User") {
        avatarSrc = report.itemDetails.profilePicture || "https://www.gravatar.com/avatar/?d=mp&s=200"
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-text">
      <div className="bg-foreground p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">Inapproptiate Content Details</h2>
        </div>

        {type === "User" && (
        <div className="mt-4">
        <div className="flex items-center space-x-3">
        <img
            src={avatarSrc}
            alt={name}
            className="h-14 w-14 rounded-full"
            onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
                e.currentTarget.onerror = null;
              }}
        />
        <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-text">
             <strong>Username:</strong> {report.itemDetails.username}
            </p>
            < p className="text-xs text-text">
              {report.itemDetails.headline}
            </p>
        </div>
        </div>

        <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
        <h3 className="font-semibold text-red-700">Report Information</h3>
        <p>
            <strong>Email:</strong> {report.itemDetails.email}
        </p>
        <p>
            <strong>About:</strong> {report.itemDetails.about|| "None"}
        </p>
        <p>
            <strong>Location:</strong> {report.itemDetails.location}
        </p>
        <p>
            <strong>Number of Connections:</strong> {report.itemDetails.numberOfConnections}
        </p>
        <p>
            <strong>Number of posts: </strong> {report.itemDetails.numberOfPosts}
        </p>
        <p>
            <strong>Number of Comments:</strong> {report.itemDetails.numberOfComments}
        </p>
        <p>
            <strong>Subscription PLan:</strong> {report.itemDetails.subscriptionPlan}
        </p>
        <p>
            <strong>Deletion Status:</strong> {report.itemDetails.isDeleted ? "Deleted" : "Not Deleted"}
        </p>
        {report.itemDetails.isDeleted && (
            <p>
            <strong>Deletion Date:</strong> {new Date(report.itemDetails.deletedAt).toLocaleDateString()}
            </p>
        )}
        <p>
            <strong>Flagged By:</strong> {report.reportData.username}
        </p>
        <p>
            <strong>Flagged Date:</strong>{" "}
            {new Date(report.reportData.createdAt).toLocaleDateString()}
        </p>
        <p>
            <strong>Flag Reason:</strong> {report.reportData.reason}
        </p>
        </div>
        </div>
        )}
        {type === "Company" && (
        <div className="mt-4">
        <div className="flex items-center space-x-3">
        <img
          src= {avatarSrc}
          alt={name}
            className="h-14 w-14 rounded-full"
        />
        <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <div>
            <div className="flex items-center space-x-3">
            <img
            src={report.itemDetails.creator.profilePicture || "https://www.gravatar.com/avatar/?d=mp&s=200"}
            alt={report.itemDetails.creator.name}
            className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col text-xs">
            <p className="text-text">
            <strong>Creator Name:</strong> {report.itemDetails.creator.name}
            </p>
            <p className="text-text">
            <strong>Creator Username:</strong> {report.itemDetails.creator.username}
            </p>
            <p className="text-text">
            <strong>Creator Email:</strong> {report.itemDetails.creator.email}
            </p>
            </div>
            </div>
            </div>
        </div>
        </div>
        <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
        <h3 className="font-semibold text-red-700">Report Information</h3>
        <p>
            <strong>Company Username:</strong> {report.itemDetails.username}
        </p>
        <p>
            <strong>Location:</strong> {report.itemDetails.location}
        </p>
        <p>
            <strong>Organization Size:</strong> {report.itemDetails.orgSize}
        </p>
        <p>
            <strong>Number of Followers:</strong> {report.itemDetails.numberOfFollowers}
        </p>
        <p>
            <strong>Number of Posts:</strong> {report.itemDetails.numberOfPosts}
        </p>
        <p>
            <strong>Number of Jobs:</strong> {report.itemDetails.numberOfJobs}
        </p>
        <p>
            <strong>Admins:</strong> 
            {report.itemDetails.admins.length === 0 ? " None" :
            (report.itemDetails.admins.map((admin, index) => (
                <li key={index} className="text-sm text-text">
                <img
                    src={admin.profilePicture || "https://www.gravatar.com/avatar/?d=mp&s=200"}
                    alt={admin.name}
                    className="h-10 w-10 rounded-full"
                />
                <strong> Name:</strong> {admin.name}
                <strong> Username:</strong> {admin.username}
                <strong> Email:</strong> {admin.email}
                </li>
            )))
            }
        </p>
        <p>
        <strong>Deletion Status:</strong> {report.itemDetails.isDeleted ? "Deleted" : "Not Deleted"}
        </p>
        {report.itemDetails.isDeleted && (
            <p>
            <strong>Deletion Date:</strong> {new Date(report.itemDetails.deletedAt).toLocaleDateString()}
            </p>
        )}
        <p>
            <strong>Flagged By:</strong> {report.reportData.username}
        </p>
        <p>
            <strong>Flagged Date:</strong>{" "}
            {new Date(report.reportData.createdAt).toLocaleDateString()}
        </p>
        <p>
            <strong>Flag Reason:</strong> {report.reportData.reason}
        </p>
        </div>
        </div>
        )}
        {type === "Post" && (
        <div className="mt-4">
        <div className="flex items-center space-x-3">
            <img
                src={avatarSrc}
                alt={name}
                className="h-14 w-14 rounded-full"
            />
        <div className="flex items-center space-x-3">
            <img
            src={report.itemDetails.companyData?.logo || (report.itemDetails.userData?.profilePicture || "https://www.gravatar.com/avatar/?d=mp&s=200")}
            alt={report.itemDetails.companyData?.name || report.itemDetails.userData?.name}
            className="h-10 w-10 rounded-full"
            />
            <div>
            <h3 className="font-bold text-lg">{report.itemDetails.companyData?.name || report.itemDetails.userData?.name}</h3>
            <h3 className=" text-sm"><strong> Username: </strong>{report.itemDetails.companyData?.username || report.itemDetails.userData?.username}</h3>
            </div>
        </div>
        </div>
        <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
        <h3 className="font-semibold text-red-700">Report Information</h3>
        <p>
            <strong>Post Text:</strong> {report.itemDetails.text}
        </p>
        <p>
            <strong>Post Tags:</strong> {report.itemDetails.tags?.length ? report.itemDetails.tags.join(", ") : "None"}
        </p>
        <p>
            <strong>Post keywords:</strong> {report.itemDetails.keywords?.length ? report.itemDetails.keywords.join(", ") : "None"}
        </p>
        <p>
            <strong>Post Media:</strong>
            {report.itemDetails.media?.length ? (
                <li className="flex flex-wrap gap-4 mt-2">
                {report.itemDetails.media.map((media, index) => (
                    <a href={media} target="_blank" rel="noopener noreferrer" key={index}>
                    <img
                        src={media}
                        alt={`Post Media ${index}`}
                        className="h-14 w-14 rounded-full object-cover"
                    />
                    </a>
                ))}
                </li>
            ) : (
                "None"
            )}
        </p>
        <p>
            <strong>Deletion Status:</strong> {report.itemDetails.isDeleted ? "Deleted" : "Not Deleted"}
        </p>
        {report.itemDetails.isDeleted && (
            <p>
            <strong>Deletion Date:</strong> {new Date(report.itemDetails.deletedAt).toLocaleDateString()}
            </p>
        )}
        <p>
            <strong>Creation Date:</strong> {new Date(report.itemDetails.createdAt).toLocaleDateString()}
        </p>
        <p>
        <strong>Flagged By:</strong> {report.reportData.username}
        </p>
        <p>
            <strong>Flagged Date:</strong>{" "}
            {new Date(report.reportData.createdAt).toLocaleDateString()}
        </p>
        <p>
            <strong>Flag Reason:</strong> {report.reportData.reason}
        </p>
        </div>
        </div>
        )}
        {type === "Comment" && (
        <div className="mt-4">
            <div className="flex items-center space-x-3">
                <img
                src={avatarSrc}
                alt={name}
                className="h-14 w-14 rounded-full"
                />
                <div className="flex items-center space-x-3">
                    <img
                    src={report.itemDetails.userData.profilePicture}
                    alt={report.itemDetails.userData.name}  
                    className="h-10 w-10 rounded-full"
                    />
                    <div>
                    <h3 className="font-bold text-lg">{report.itemDetails.userData?.name}</h3>
                    <h3 className=" text-sm"><strong> Username: </strong>{report.itemDetails.userData?.username}</h3>
                    </div>
                 </div>
            </div>
            <div className="bg-red-100 p-4 rounded-md mt-4 text-black">
                <h3 className="font-semibold text-red-700">Report Information</h3>
                <p>
                    <strong>Comment Text:</strong> {report.itemDetails.text}
                </p>
                <p>
                    <strong>Deletion Status:</strong> {report.itemDetails.isDeleted ? "Deleted" : "Not Deleted"}
                </p>
                {report.itemDetails.isDeleted && (
                    <p>
                    <strong>Deletion Date:</strong> {new Date(report.itemDetails.deletedAt).toLocaleDateString()}
                    </p>
                )}
                <p>
                    <strong>Comment Date:</strong> {new Date(report.itemDetails.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong>Flagged By:</strong> {report.reportData.username}
                </p>
                <p>
                    <strong>Flagged Date:</strong>{" "}
                    {new Date(report.reportData.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong>Flag Reason:</strong> {report.reportData.reason}
                </p>   
            </div>
        </div>
        )}

        <div className="flex justify-end mt-4">
          <button
           data-testid="close-button"
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
