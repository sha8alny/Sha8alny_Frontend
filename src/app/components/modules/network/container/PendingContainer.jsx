"use client"
import { useState,useEffect } from "react";
import {getConnectionRequests, getSentConnectionRequests, manageConnectionRequest, cancelConnectionRequest} from "../../../../services/connectionManagement"
import Pending from "../presentation/Pending";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";
import { useFilters } from "@/app/context/NetworkFilterContext";

const PendingContainer =({filteredResults})=>{
    const [manageRequest, setmanageRequest] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
    const [pageReceived, setpageReceived] = useState(1);
    const [pageSent, setpageSent] = useState(1);
    const [hasMoreReceived, sethasMoreReceived] = useState(true);
    const [hasMoreSent, sethasMoreSent] = useState(true);
    const [tab, setTab] = useState("received");
    const {filters} = useFilters();


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