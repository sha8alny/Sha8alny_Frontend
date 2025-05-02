"use client"
import ProfileCard from "@/app/components/ui/ProfileCard";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

const FollowersAndFollowings = ({
    tab,
    setTab,
    data,
    isLoading,
    isError,
    nextPage,
    prevPage,
    page,
    hasMore,
    onRemoveFollow,
    removeFollowLoading,
    openDeleteDialog,
    setOpenDeleteDialog,
    getConnectionDegree
    
}) => {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-6 bg-foreground p-3 rounded-2xl shadow-2xl">

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 w-full justify-center">
            <button
                data-testid="followers-button"
                onClick={() => setTab("followers")}
                className={`w-full p-2 rounded-lg transition ${tab === "followers" ? "bg-secondary text-primary" : "bg-transparent text-primary hover:bg-secondary hover:text-white"}`}
            >
                Followers
            </button>
            <button
                data-testid="following-button"
                onClick={() => setTab("following")}
                className={`w-full p-2 rounded-lg transition ${tab === "following" ? "bg-secondary text-primary" : "bg-transparent text-primary hover:bg-secondary hover:text-white"}`}
            >
                Following
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
            <span className="text-primary">No {tab} yet</span>{" "}
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
          <div className="bg-foreground p-1 rounded-2xl w-full grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          { data.map((account, index) => (
                <ProfileCard
                    data-testid="follow-card"
                    key={index}
                    username={account.username}
                    name={account.name}
                    title={account.headline}
                    profilePic={account.profilePicture}
                    coverPic={account.coverPhoto}
                    numberOfConnections={account.numberOfConnections}
                    buttonText=""
                    showButton={false}
                    showRemoveButton={tab === "following"}
                    onRemove={() => {
                        onRemoveFollow(account.username);
                    }}
                    removeLoading={removeFollowLoading}
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

export default FollowersAndFollowings;