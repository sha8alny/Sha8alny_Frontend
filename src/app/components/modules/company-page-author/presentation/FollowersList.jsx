import { Search} from '@mui/icons-material';

export default function FollowersList({followers, goToUserPage, filteredFollowers, searchTerm, setSearchTerm}){    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-foreground rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-text" >Followers</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text" />
              <input
                type="text"
                placeholder="Search followers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredFollowers.length > 0 ? (
              filteredFollowers.map(follower => (
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