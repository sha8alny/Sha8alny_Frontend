"use client"
import { useState , useEffect} from "react";
import {getConnections, removeConnection, getConnectionMutuals} from "../../../../services/connectionManagement"
import Connections from "../presentation/Connections";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";
import { useFilters } from "@/app/context/NetworkFilterContext";

const ConnectionsContainer =()=>{
    const [deleteConnectionLoading, setDeleteConnectionLoading] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const {filters} = useFilters();

    const { data: connections = [], isLoading, isError } = useQuery({
        queryKey: ["connections",filters, page],
        queryFn: ({queryKey}) => getConnections(
          filters.name,
          filters.industry,
          filters.location,
          filters.connectionDegree,
          queryKey[2],
        ),
        keepPreviousData: true,
      });
      

    useEffect(() => {
        const checkHasMore = async () => {
          if (connections && connections.length === 9) {
            try {
              const nextPageData = await getConnections(
                filters.name,
                filters.industry,
                filters.location,
                filters.connectionDegree,
                page + 1
              );
              setHasMore(nextPageData.length > 0);
            } catch (error) {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
        };
        checkHasMore();
      }, [connections, page]);
      


    const removeMutation = useMutation({
      mutationFn :(username)=> removeConnection(username),
    })
    const handleRemoveConnection = (username) => {
        setDeleteConnectionLoading(true);
        removeMutation.mutate(username, {
            onSuccess: () => {
                toast("Connection removed successfully");
                queryClient.invalidateQueries(["connections",page]);
                setDeleteConnectionLoading(false);
            },
            onError: (error) => {
                toast("Error removing connection", false)
                setDeleteConnectionLoading(false);
            },
        });
    };
    
    const nextPage = () => {
        if (hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }
    const prevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    }
    

    return(
        <Connections
            loading={isLoading}
            connections={connections}
            onRemoveConnection={handleRemoveConnection}
            removeConnectionLoading={deleteConnectionLoading}
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
            nextPage={ nextPage}
            prevPage={ prevPage}
            hasMore={hasMore}   
            page={page}
         />
    )
}

export default ConnectionsContainer;