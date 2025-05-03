import { Button } from "@/app/components/ui/Button";

/**
 * @namespace FollowersList
 */

/**
 * A component that displays a list of followers with options to block or unblock them.
 * It shows the follower's profile information and allows navigation to their profile page.
 *
 * @memberof FollowersList
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.followers - The list of followers to be displayed.
 * @param {Function} props.goToUserPage - A function to navigate to the selected user's profile page.
 * @param {Function} props.block - A function to block a user.
 * @param {Function} props.unblock - A function to unblock a user.
 * @param {boolean} [props.isBlocked=false] - Flag to indicate if the list is for blocked followers.
 * @returns {JSX.Element} The rendered component.
 */

export default function FollowersList({followers, goToUserPage, block, unblock, isBlocked=false }){    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-foreground rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-text" > {isBlocked ? "Blocked Followers" :"Followers"} </h1>
          </div>
          <div className="space-y-4">
            {followers.length > 0 ? (
              followers.map(follower => (
                <div key={follower.username} className="flex items-center justify-between p-2 border border-gray-500 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <img 
                        src={follower.profilePicture || "/placeholder.svg"} 
                        alt="Profile photo"
                        className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                        <h3 className="font-medium text-text cursor-pointer hover:underline transition-all duration-150" onClick={()=>goToUserPage(follower)}>{follower.name}</h3>
                        <p className="text-sm text-gray-500">{follower.headline}</p>
                        <p className="text-sm text-gray-500">{follower.numberOfConnections} connections</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end gap-2">
                        {isBlocked?(
                            <Button variant="default" className ="bg-secondary rounded-full cursor-pointer" data-testid="unblock-follower-button" onClick={()=>unblock(follower.username)}> unBlock </Button>
                        ):(
                            <Button variant="default" className ="bg-secondary rounded-full cursor-pointer" data-testid="block-follower-button" onClick={()=>block(follower.username)}> Block </Button>
                        )}
                    </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                {isBlocked? <p className="text-gray-500">No blocked followers found </p> : <p className="text-gray-500">No followers found</p> }
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end text-sm text-gray-500 space-x-4">
            <button className="hover:underline cursor-pointer" data-testid="Previous-button" >Previous</button>
            <button className="hover:underline cursor-pointer" data-testid="Next-button">Next</button>
          </div>
        </div>
    );
}