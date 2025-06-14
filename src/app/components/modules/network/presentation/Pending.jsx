"use client"
import ProfileCard from "@/app/components/ui/ProfileCard";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

/**
 * Pending component displays a list of received or sent connection requests with pagination controls.
 * Handles loading states, empty states, and provides functionality to manage or cancel requests.
 *
 * @namespace network
 * @module network
 * @component
 *
 * @param {Object} props - The component props.
 * @param {string} props.tab - The currently active tab ("received" or "sent").
 * @param {Function} props.setTab - Function to set the active tab.
 * @param {Array} props.data - The list of connection requests to display.
 * @param {boolean} props.isLoading - Indicates whether the data is currently being loaded.
 * @param {boolean} props.isError - Indicates whether there was an error loading the data.
 * @param {Function} props.nextPage - Function to navigate to the next page of data.
 * @param {Function} props.prevPage - Function to navigate to the previous page of data.
 * @param {number} props.page - The current page number for pagination.
 * @param {boolean} props.hasMore - Indicates whether there are more items to fetch for pagination.
 * @param {Function} props.onManageRequest - Function to handle managing a received request (e.g., accept or reject).
 * @param {Function} props.onCancelRequest - Function to handle canceling a sent request.
 * @param {boolean} props.manageRequest - Indicates whether a request management action is in progress.
 * @param {Object|null} props.openDeleteDialog - The currently open delete confirmation dialog, if any.
 * @param {Function} props.setOpenDeleteDialog - Function to set the currently open delete confirmation dialog.
 * @param {Function} props.getConnectionDegree - Function to get the connection degree of a user.
 *
 * @returns {JSX.Element} The Pending component.
 */

const Pending = ({
    tab,
    setTab,
    data,
    isLoading,
    isError,
    nextPage,
    prevPage,
    page,
    hasMore,
    onManageRequest,
    onCancelRequest,
    manageRequest,
    openDeleteDialog,
    setOpenDeleteDialog,
    getConnectionDegree
    
}) => {
  console.log("pendings",data)
    return (
      <div className="w-full flex flex-col justify-center items-center gap-6 bg-foreground p-3 rounded-2xl shadow-2xl ">

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 w-full justify-center">
            <button
                data-testid="received-button"
                onClick={() => setTab("received")}
                className={`w-full p-2 rounded-lg transition ${tab === "received" ? "bg-secondary text-primary" : "bg-transparent text-primary hover:bg-secondary hover:text-white"}`}
            >
                Received Requests
            </button>
            <button
                data-testid="sent-button"
                onClick={() => setTab("sent")}
                className={`w-full p-2 rounded-lg transition ${tab === "sent" ? "bg-secondary text-primary" : "bg-transparent text-primary hover:bg-secondary hover:text-white"}`}
            >
                Sent Requests
            </button>
        </div>

        {isError && (
            <div className="w-full flex flex-col justify-center items-center gap-2 h-full mt-10 mb-25">
                <span className="text-red-500">Error loading data</span>
            </div>
        )}
        

          {isLoading ? (
            <div className="w-full flex flex-col justify-center items-center gap-2 h-full mt-10 mb-25">
          <div className="size-12 border-2 border-t-transparent rounded-full animate-spin border-secondary" />
          <span className="text-primary">Loading...</span>{" "}
           </div>
          ) : data.length===0? (
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
            <span className="text-primary">No {tab} requests yet</span>{" "}
            {tab==="sent" && (
                <div className="flex flex-col items-center gap-2">
            <span className="text-primary mt-2 mb-2">Ready to expand your network?</span>{" "}
              <button
                data-testid="explore-connections-button"
                className="bg-secondary text-primary px-4 py-2 rounded-lg"
                onClick={() => window.location.href = "/search/results?keyword=&type=user"}
              >
                Explore Connections
              </button>
              </div>
                )}
             </div>
          ) : (
            <>
          <div className="bg-foreground p-1 rounded-2xl w-full grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          { data.map((account, index) => (
                <ProfileCard
                    data-testid="pending-card"
                    key={index}
                    username={account.username}
                    name={account.name}
                    title={account.headline}
                    profilePic={account.profilePicture}
                    coverPic={account.coverPhoto}
                    numberOfConnections={account.numberOfConnections}
                    buttonText="Accept"
                    buttonAction={() => {
                        onManageRequest({ requestName: account.username, status: "accepted" });                    }
                    }
                    showButton={tab === "received"}
                    showRemoveButton={true}
                    onRemove={() => {
                       if (tab === "sent") {
                        onCancelRequest({ requestName: account.username });
                        } else {
                        onManageRequest({ requestName: account.username, status: "rejected" });}
                    }}
                    removeLoading={manageRequest}
                    openDeleteDialog={openDeleteDialog===account.username}
                    setOpenDeleteDialog={(isOpen)=>{
                        setOpenDeleteDialog(isOpen ? account.username : null);
                    }}
                    getConnectionDegree={getConnectionDegree(account.connectionDegree)}
                />
            ))}
            </div>
          
          <div className="flex justify-between gap-4 mt-4 w-full">
            {page>1 && (
            <button
                data-testid="prev-button"
                onClick={prevPage}
                disabled={page === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${page === 1 ? 'bg-transparent text-gray-500 cursor-not-allowed' : 'bg-transparent text-white hover:bg-secondary'}`}
            >
                <ArrowBackIos className="text-white text-sm" />
            </button>
            )}
            {hasMore && !isLoading && (
            <button
                data-testid="next-button"
                onClick={nextPage}
                disabled={!hasMore}
                className={`px-4 py-2 rounded-lg ${!hasMore ? 'bg-transparent text-gray-500 cursor-not-allowed' : 'bg-transparent text-white hover:bg-secondary'}`}
            >
                <ArrowForwardIos className="text-white tect-sm" />
            </button>
            )}
        </div>
        </>
          )}



         </div>
         
    )
}

export default Pending;
