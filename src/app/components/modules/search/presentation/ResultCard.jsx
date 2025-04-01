"use client";   
import ResultCardSkeleton from "@/app/components/modules/search/presentation/ResultCardSkeleton";

function ResultsCard({ title, icon, children, onViewMore, viewMoreText, isLoading }) {
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

      {onViewMore && (
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
