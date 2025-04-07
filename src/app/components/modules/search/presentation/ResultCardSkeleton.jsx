function ResultsCardSkeleton({title,icon}) {
  return (
    <div className="bg-foreground text-text border-gray-800 shadow-sm p-4 rounded-lg animate-pulse">
     <h2 className="text-lg font-bold mb-4 flex items-center gap-1.5">
        {icon} {title}
      </h2>
      <div className="space-y-4">
        <div className="h-4 bg-gray-500 rounded w-full"></div>
        <div className="h-4 bg-gray-500 rounded w-full"></div>
        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
      </div>
      <div className="border-t dark:border-gray-500 mt-4"></div>
      <button className="mt-3 w-full text-center text-sm font-medium cursor-pointer py-2 rounded-md transition-colors duration-200 bg-gray-500 "></button>
    </div>
  );
}

export default ResultsCardSkeleton;
