import { useQuery } from "@tanstack/react-query";
import { SidebarPresentation } from "../../admin/presentation/SidebarPresentation";

function Sidebar(){
    const {
        data: feed,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["feed"],
        queryFn: () => fetchFeed(),
        staleTime: 1000 * 30, // 30 seconds
    });

    return(
        <SidebarPresentation/>
    )
}

export default Sidebar;