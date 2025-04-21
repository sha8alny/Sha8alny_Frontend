"use client";   
import ResultCardSkeleton from "@/app/components/modules/search/presentation/ResultCardSkeleton";
/**
 * @namespace search
 * @module search
 * @description A reusable card component for displaying search results with optional loading state and "View More" functionality.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the result card.
 * @param {React.ReactNode} props.icon - The icon to display next to the title.
 * @param {React.ReactNode} props.children - The content to display inside the card.
 * @param {Function} [props.onViewMore] - Callback function triggered when the "View More" button is clicked.
 * @param {string} [props.viewMoreText] - The text to display on the "View More" button.
 * @param {boolean} [props.isLoading] - Flag to indicate whether the card is in a loading state.
 */

function ResultsCard({ title, icon, children, onViewMore, viewMoreText, isLoading, flag= true }) {
  if (isLoading) {
    return (
        <ResultCardSkeleton title={title} icon={icon} />
    )
}
  return (
    <div className="bg-foreground text-text border-gray-800 shadow-sm p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-1.5">
        {icon} {title}
      </h2>

      {children}

      {onViewMore && flag && (
        <>
          <div className="border-t dark:border-gray-500"></div>
          <button
            onClick={onViewMore}
            className="bg-foreground mt-3 w-full text-center text-sm font-medium cursor-pointer py-2 rounded-md transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-500 text-text"
          >
            {viewMoreText}
          </button>
        </>
      )}
    </div>
  );
}

export default ResultsCard;
