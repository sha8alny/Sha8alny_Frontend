import { Button } from "@/app/components/ui/Button";
import { AccessTime, Clear, FilterList } from "@mui/icons-material";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
/**
 * @namespace jobs
 * @module jobs
 */
/**
 * Recent Searches component for displaying user's search history
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.recentSearches - Array of recent search objects
 * @param {Function} props.onSearchClick - Handler for when a search is clicked
 * @param {Function} props.onClearOne - Handler for removing a single search item
 * @param {Function} props.onClearAll - Handler for clearing all search history
 * @param {Function} props.formatTimestamp - Function to format timestamp to readable string
 * 
 * @returns {JSX.Element|null} - Returns the search history UI or null if no search history
 * 
 * @example
 * // Each search object is expected to have this structure:
 * const searchItem = {
 *   label: "Frontend Developer",    // Display text
 *   query: "frontend-developer",    // Search query to execute
 *   filters: {                      // Optional filters that were applied
 *     location: "Remote",
 *     experience: "2-5 years"
 *   },
 *   timestamp: 1678954321000        // When the search was performed
 * };
 */
const RecentSearches = ({
  recentSearches,
  onSearchClick,
  onClearOne,
  onClearAll,
  formatTimestamp,
}) => {
  if (!recentSearches.length) return null;

  const renderTooltipContent = (filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return <p>All Jobs</p>;
    }

    return (
      <div className="space-y-1 max-w-xs">
        <p className="font-medium">Applied Filters:</p>
        <ul className="text-xs space-y-1">
          {Object.entries(filters).map(([key, value], idx) => (
            <li key={idx} className="flex">
              <span className="font-medium min-w-20">{key}:</span>
              <span className="ml-1 truncate">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-foreground rounded-3xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-text flex items-center">
          <AccessTime className="h-4 w-4 mr-1" />
          Recent Searches
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-text"
        >
          Clear all
        </Button>
      </div>

      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2">
          <TooltipProvider>
            {recentSearches.map((search, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => onSearchClick(search.query)}
                    className="bg-hover border-secondary hover:text-secondary text-sm rounded-full text-text flex items-center gap-1 group"
                    aria-label={`Search for ${search.label}`}
                  >
                    {search.filters &&
                      Object.keys(search.filters).length > 0 && (
                        <FilterList className="h-3 w-3 mr-1" />
                      )}
                    <span>{search.label}</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {formatTimestamp(search.timestamp)}
                    </span>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onClearOne(index);
                      }}
                      className="cursor-pointer"
                      aria-label="Remove search"
                    >
                      <Clear
                        className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {renderTooltipContent(search.filters)}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default RecentSearches;
