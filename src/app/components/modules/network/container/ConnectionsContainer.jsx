"use client"
import { useState , useEffect} from "react";
import {getConnections, removeConnection} from "../../../../services/connectionManagement"
import Connections from "../presentation/Connections";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";
import { useFilters } from "@/app/context/NetworkFilterContext";

/**
 * Container component for managing and displaying user connections.
 * Handles state management, API calls, and passes data to the `Connections` presentation component.
 *
 * @namespace network
 * @module network
 * @component
 */

const ConnectionsContainer =()=>{
  /**
 * Container component for managing and displaying user connections.
 * Handles state management, API calls, and passes data to the `Connections` presentation component.
 *
 * @namespace network
 * @module network
 * @component
 */
    const [deleteConnectionLoading, setDeleteConnectionLoading] = useState(false);
      /**
   * React Query's query client for managing cache and queries.
   * @type {QueryClient}
   */
    const queryClient = useQueryClient();
    
  /**
   * Toast function for displaying notifications.
   * @type {Function}
   */
    const toast = useToast();
    
  /**
   * State for controlling the visibility of the delete confirmation dialog.
   * @type {Object|null}
   */
    const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
    /**
   * Current page number for pagination.
   * @type {number}
   */
    const [page, setPage] = useState(1);
      /**
   * Indicates whether there are more connections to fetch for pagination.
   * @type {boolean}
   */
    const [hasMore, setHasMore] = useState(true);
      /**
   * Filters applied to the connections query.
   * @type {Object}
   * @property {string} name - The name filter for connections.
   * @property {string} industry - The industry filter for connections.
   * @property {string} location - The location filter for connections.
   * @property {string} connectionDegree - The degree of connection filter (e.g., 1st, 2nd).
   */
    const {filters} = useFilters();

      /**
   * Fetches the list of connections using React Query.
   * @type {Object}
   * @property {Array} data - The list of connections fetched from the server.
   * @property {boolean} isLoading - Indicates if the connections are currently being loaded.
   * @property {boolean} isError - Indicates if there was an error fetching the connections.
   */

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
      
  /**
   * Mutation for removing a connection.
   * Calls the `removeConnection` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

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