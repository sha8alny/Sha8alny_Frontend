"use client"
import { useState , useEffect} from "react";
import {getConnections, removeConnection} from "../../../../services/connectionManagement"
import Connections from "../presentation/Connections";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";

const ConnectionsContainer =({filteredResults})=>{
    const [deleteConnectionLoading, setDeleteConnectionLoading] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { data: connections = [], isLoading, isError } = useQuery({
        queryKey: ["connections", page],
        queryFn: ({ queryKey }) => getConnections(queryKey[1]),
        keepPreviousData: true,
      });
      

    useEffect(() => {
        const checkHasMore = async () => {
          if (connections && connections.length === 9) {
            try {
              const nextPageData = await getConnections(page + 1);
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
            loading={filteredResults?.isLoading || isLoading}
            connections={filteredResults?.results || connections}
            onRemoveConnection={handleRemoveConnection}
            removeConnectionLoading={deleteConnectionLoading}
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
            nextPage={filteredResults?.nextPage || nextPage}
            prevPage={filteredResults?.prevPage || prevPage}
            hasMore={filteredResults?.hasMore || hasMore}   
            page={page}
         />
    )
}

export default ConnectionsContainer;