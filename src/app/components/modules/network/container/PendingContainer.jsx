"use client"
import { useState,useEffect } from "react";
import {getConnectionRequests, getSentConnectionRequests, manageConnectionRequest, cancelConnectionRequest} from "../../../../services/connectionManagement"
import Pending from "../presentation/Pending";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";
import { useFilters } from "@/app/context/NetworkFilterContext";

/**
 * Container component for managing and displaying pending connection requests.
 * Handles state management, API calls, and passes data to the `Pending` presentation component.
 *
 * @namespace network
 * @module network
 * @component
 */


const PendingContainer =()=>{
    const [manageRequest, setmanageRequest] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
      /**
   * State for the current page number for received pending requests pagination.
   * @type {number}
   */
    const [pageReceived, setpageReceived] = useState(1);
      /**
   * State for the current page number for sent pending requests pagination.
   * @type {number}
   */
    const [pageSent, setpageSent] = useState(1);
      /**
   * Indicates whether there are more received pending requests to fetch for pagination.
   * @type {boolean}
   */
    const [hasMoreReceived, sethasMoreReceived] = useState(true);
    
  /**
   * Indicates whether there are more sent pending requests to fetch for pagination.
   * @type {boolean}
   */
    const [hasMoreSent, sethasMoreSent] = useState(true);
    const [tab, setTab] = useState("received");
      /**
   * Filters applied to the pending requests queries.
   * @type {Object}
   * @property {string} name - The name filter for pending requests.
   * @property {string} industry - The industry filter for pending requests.
   * @property {string} location - The location filter for pending requests.
   * @property {string} connectionDegree - The degree of connection filter (e.g., 1st, 2nd).
   */
    const {filters} = useFilters();

  /**
   * Fetches the list of received pending requests using React Query.
   * @type {Object}
   * @property {Array} data - The list of received pending requests fetched from the server.
   * @property {boolean} isLoading - Indicates if the received pending requests are currently being loaded.
   * @property {boolean} isError - Indicates if there was an error fetching the received pending requests.
   */
    const { data: received=[], isLoading: isReceivedLoading, isErrorReceived } = useQuery(
        {queryKey:["received",filters,pageReceived], 
        queryFn:({queryKey})=>getConnectionRequests(
            filters.name,
            filters.industry,
            filters.location,
            filters.connectionDegree,
            queryKey[2],
            ),
        });

      /**
   * Fetches the list of sent pending requests using React Query.
   * @type {Object}
   * @property {Array} data - The list of sent pending requests fetched from the server.
   * @property {boolean} isLoading - Indicates if the sent pending requests are currently being loaded.
   * @property {boolean} isError - Indicates if there was an error fetching the sent pending requests.
   */    
    const { data: sent = [], isLoading: isSentLoading, isErrorSend } = useQuery(
        {queryKey:["sent",filters,pageSent], 
        queryFn:({queryKey})=>getSentConnectionRequests(
            filters.name,
            filters.industry,
            filters.location,
            filters.connectionDegree,
            queryKey[2],
            ),
           });
  /**
   * Effect to check if there are more received pending requests to fetch for pagination.
   */
    useEffect(() => {
        const checkhasMoreReceived = async () => {
            if (received && received.length === 9) {
                try {
                    const nextPageData = await getConnectionRequests(
                        filters.name,
                        filters.industry,
                        filters.location,
                        filters.connectionDegree,
                        pageReceived + 1
                    );
                    sethasMoreReceived(nextPageData.length > 0);
                } catch (error) {
                    sethasMoreReceived(false);
                }
            } else {
                sethasMoreReceived(false);
            }
        };
          /**
   * Effect to check if there are more sent pending requests to fetch for pagination.
   */
        const checkhasMoreSent = async () => {
            if (sent && sent.length === 9) {
                try {
                    const nextPageData = await getFollowing(
                        filters.name,
                        filters.industry,
                        filters.location,
                        filters.connectionDegree,
                        pageSent + 1
                    );
                    sethasMoreSent(nextPageData.sent.length > 0);
                } catch (error) {
                    sethasMoreSent(false);
                }
            } else {
                sethasMoreSent(false);
            }
        };
        checkhasMoreReceived();
        checkhasMoreSent();
    }, [received, sent, pageReceived, pageSent]);


    const manageMutation = useMutation({
        mutationFn: manageConnectionRequest,
    });

    const manageRequests = ({requestName,status}) => {
        setmanageRequest(true);
        
        manageMutation.mutate({username:requestName, status}, {
            onSuccess: () => {
                    toast(`Connection request ${status === "accepted" ? "accepted" : "declined"} successfully`);
                    queryClient.invalidateQueries(["received", page]);
                    setmanageRequest(false);
                    if (status !== "accepted") setOpenDeleteDialog(false);
                
            },
            onError: (error) => {
                toast("Error managing request", false)
                setmanageRequest(false);
            },
        });
    };
    const cancelMutation = useMutation({
        mutationFn: cancelConnectionRequest,
    });
    const handleCancelRequest = ({requestName}) => {
        cancelMutation.mutate({username:requestName}, {
            onSuccess: () => {
                toast("Connection request canceled successfully");
                queryClient.invalidateQueries(["sent", page]);
            },
            onError: (error) => {
                toast("Error canceling request", false);
            },
        });
    };

    const nextpageReceived = () => {
        if (hasMoreReceived) {
            setpageReceived(prevPage => prevPage + 1);
        }
    };
    const prevpageReceived = () => {
        if (page > 1) {
            setpageReceived(prevPage => prevPage - 1);
        }
    };
    const nextpageSent = () => {
        if (hasMoreSent) {
            setpageSent(prevPage => prevPage + 1);
        }
    };
    const prevpageSent = () => {
        if (page > 1) {
            setpageSent(prevPage => prevPage - 1);
        }
    };

    const isLoading = tab === "received" ? isReceivedLoading : isSentLoading;
    const isError = tab === "received" ? isErrorReceived : isErrorSend;
    const nextPage = tab === "received" ? nextpageReceived : nextpageSent;
    const prevPage = tab === "received" ? prevpageReceived : prevpageSent;
    const page = tab === "received" ? pageReceived : pageSent;
    const hasMore = tab === "received" ? hasMoreReceived : hasMoreSent;
    const data = tab === "received" ? received : sent;

    const getConnectionDegree = (connectionDegree) => {
        switch (connectionDegree) {
          case 1:
            return "1st";
          case 2:
            return "2nd";
          case 3:
            return "3rd+";
          default:
            return "";
        }
      };

    
    return(
        <Pending
            tab={tab}
            setTab={setTab}
            data={data}
            isLoading={isLoading}
            isError={isError}
            nextPage={nextPage}
            prevPage={prevPage}
            page={page}
            hasMore={hasMore}
            onManageRequest={manageRequests}
            onCancelRequest={handleCancelRequest}
            manageRequest={manageRequest}
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
            getConnectionDegree={getConnectionDegree}
         />
    )
}

export default PendingContainer;