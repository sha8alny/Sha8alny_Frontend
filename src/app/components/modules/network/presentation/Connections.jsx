"use client"
import ProfileCard from "@/app/components/ui/ProfileCard";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
/**
 * Connections component displays a list of user connections with pagination controls.
 * Handles loading states, empty states, and provides functionality to remove connections.
 *
 * @namespace network
 * @module network
 * @component
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.loading - Indicates whether the connections are currently being loaded.
 * @param {Array} props.connections - The list of user connections to display.
 * @param {Function} props.onRemoveConnection - Function to handle removing a connection.
 * @param {boolean} props.removeConnectionLoading - Indicates whether a connection removal is in progress.
 * @param {Object|null} props.openDeleteDialog - The currently open delete confirmation dialog, if any.
 * @param {Function} props.setOpenDeleteDialog - Function to set the currently open delete confirmation dialog.
 * @param {Function} props.nextPage - Function to navigate to the next page of connections.
 * @param {Function} props.prevPage - Function to navigate to the previous page of connections.
 * @param {boolean} props.hasMore - Indicates whether there are more connections to fetch for pagination.
 * @param {number} props.page - The current page number for pagination.
 *
 * @returns {JSX.Element} The Connections component.
 */
const Connections = ({
    loading,
    connections,
    onRemoveConnection,
    removeConnectionLoading,
    openDeleteDialog,
    setOpenDeleteDialog,
    nextPage,
    prevPage,
    hasMore,
    page,
}) => {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-6 bg-foreground p-3 rounded-2xl shadow-2xl ">

          {loading ? (
            <div className="w-full flex flex-col justify-center items-center gap-2 h-full mt-25 mb-25">
          <div className="size-12 border-2 border-t-transparent rounded-full animate-spin border-secondary" />
          <span className="text-primary">Loading...</span>{" "}
           </div>
          ) : connections.length===0? (
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
            <span className="text-primary">No connections yet</span>{" "}
            <span className="text-primary mt-2 mb-2">Ready to expand your network?</span>{" "}
              <button
                data-testid="explore-connections-button"
                className="bg-secondary text-primary px-4 py-2 rounded-lg"
                onClick={() => window.location.href = "/search/results?keyword=&type=user"}
              >
                Explore Connections
              </button>
             </div>
          ) : (
            <>
          <div className="bg-foreground p-1 rounded-2xl  w-full grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          { connections.map((connection, index) => (
              ((connection.isConnected=== "accepted") && (
                <ProfileCard
                    data-testid="connection-card"
                    key={index}
                    username={connection.username}
                    name={connection.name}
                    title={connection.headline}
                    profilePic={connection.profilePicture}
                    coverPic={connection.coverPhoto}
                    numberOfConnections={connection.numberOfConnections}
                    buttonText="Message"
                    buttonAction={() => {
                        window.location.href = `/messages?username=${connection?.username}`;
                    }}
                    showButton={true}
                    showRemoveButton={true}
                    onRemove={() => 
                        onRemoveConnection(connection.username)
                    }
                    removeLoading={removeConnectionLoading}
                    openDeleteDialog={openDeleteDialog===connection.username}
                    setOpenDeleteDialog={(isOpen)=>{
                        setOpenDeleteDialog(isOpen ? connection.username : null);
                    }}
                />
              ))
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
            {hasMore && !loading && (
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

export default Connections;