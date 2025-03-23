import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/Table";


const TableSkeleton = () => {
    return (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="animate-pulse">
              <TableCell>
                <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-24"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-400   dark:bg-gray-700  rounded w-16"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-20"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-400 dark:bg-gray-700  rounded w-28"></div>
              </TableCell>
              <TableCell className="w-[80px]">
                <div className="h-4 bg-gray-400 dark:bg-gray-700  rounded w-16"></div>
              </TableCell>
            </TableRow>
          ))}
        </>
      );
}

export default TableSkeleton

