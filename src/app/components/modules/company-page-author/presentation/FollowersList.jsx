import { Search} from '@mui/icons-material';

export default function FollowersList({followers, goToUserPage}){    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-foreground rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-text" >Followers</h1>
          </div>
          <div className="space-y-4">
            {followers.length > 0 ? (
              followers.map(follower => (
                <div key={follower._id} className="flex items-center justify-between p-2 border border-gray-500 rounded-lg">
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
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No followers found matching your search</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end text-sm text-gray-500 space-x-4">
            <button className="hover:underline cursor-pointer">Previous</button>
            <button className="hover:underline cursor-pointer">Next</button>
          </div>
        </div>
    );
}