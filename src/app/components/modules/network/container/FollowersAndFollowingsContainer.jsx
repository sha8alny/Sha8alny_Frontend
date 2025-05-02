"use client"
import { useState,useEffect } from "react";
import {getFollowers,getFollowing,unFollowUser} from "../../../../services/connectionManagement"
import FollowersAndFollowings from "../presentation/FollowersAndFollowings";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";
import { useFilters } from "@/app/context/NetworkFilterContext";

const FollowersAndFollowingsContainer =()=>{
    const [removeFollowLoading, setRemoveFollowLoading] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
    const [pageFollowers, setPageFollowers] = useState(1);
    const [pageFollowing, setPageFollowing] = useState(1);
    const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
    const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
    const [tab, setTab] = useState("followers");
    const {filters} = useFilters();


    const { data: followers=[], isLoading: isFollowersLoading, isErrorFollowers } = useQuery(
        {queryKey:["followers",filters,pageFollowers],
         queryFn:({queryKey})=>getFollowers(
            filters.name,
            filters.industry,
            filters.location,
            filters.connectionDegree,
            queryKey[2],
        ),}
            );
    const { data: following=[], isLoading: isFollowingLoading, isErrorFollowings } = useQuery(
        {queryKey:["following",filters,pageFollowing],
         queryFn:({queryKey})=>getFollowing(
            filters.name,
            filters.industry,
            filters.location,
            filters.connectionDegree,
            queryKey[2],
         ),
           });
    

    useEffect(() => {
        const checkHasMoreFollowers = async () => {
            if (followers && followers.length === 9) {
                try {
                    const nextPageData = await getFollowers(
                        filters.name,
                        filters.industry,
                        filters.location,
                        filters.connectionDegree,
                        pageFollowers + 1
                    );
                    setHasMoreFollowers(nextPageData.length > 0);
                } catch (error) {
                    setHasMoreFollowers(false);
                }
            } else {
                setHasMoreFollowers(false);
            }
        };
        const checkHasMoreFollowing = async () => {
            if (following && following.length === 9) {
                try {
                    const nextPageData = await getFollowing(
                        filters.name,
                        filters.industry,
                        filters.location,
                        filters.connectionDegree,
                        pageFollowing + 1
                    );
                    setHasMoreFollowing(nextPageData.length > 0);
                } catch (error) {
                    setHasMoreFollowing(false);
                }
            } else {
                setHasMoreFollowing(false);
            }
        };
        checkHasMoreFollowers();
        checkHasMoreFollowing();
    }, [followers, following, pageFollowers, pageFollowing]);


    const removeMutation = useMutation({
        mutationFn: unFollowUser,
    });

    const handleRemoveFollow = (username) => {
        setRemoveFollowLoading(true);
        removeMutation.mutate(username, {
            onSuccess: () => {
                toast("Follow removed successfully");
                queryClient.invalidateQueries("following",pageFollowing);
                setRemoveFollowLoading(false);
            },
            onError: (error) => {
                toast("Error removing follow", false)
                setRemoveFollowLoading(false);
            },
        });
    };

    const nextPageFollowers = () => {
        if (hasMoreFollowers) {
            setPageFollowers(prevPage => prevPage + 1);
        }
    };
    const prevPageFollowers = () => {
        if (page > 1) {
            setPageFollowers(prevPage => prevPage - 1);
        }
    };
    const nextPageFollowing = () => {
        if (hasMoreFollowing) {
            setPageFollowing(prevPage => prevPage + 1);
        }
    };
    const prevPageFollowing = () => {
        if (page > 1) {
            setPageFollowing(prevPage => prevPage - 1);
        }
    };
    const isLoading = tab === "followers" ? isFollowersLoading : isFollowingLoading;
    const isError = tab === "followers" ? isErrorFollowers : isErrorFollowings;
    const nextPage = tab === "followers" ? nextPageFollowers : nextPageFollowing;
    const prevPage = tab === "followers" ? prevPageFollowers : prevPageFollowing;
    const page = tab === "followers" ? pageFollowers : pageFollowing;
    const hasMore = tab === "followers" ? hasMoreFollowers : hasMoreFollowing;
    const data = tab === "followers" ? followers : following;
    
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
        <FollowersAndFollowings
            tab={tab}
            setTab={setTab}
            data={data}
            isLoading={isLoading}
            isError={isError}
            nextPage={nextPage}
            prevPage={prevPage}
            page={page}
            hasMore={hasMore}
            onRemoveFollow={handleRemoveFollow}
            removeFollowLoading={removeFollowLoading}
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
            getConnectionDegree={getConnectionDegree}
         />
    )
}

export default FollowersAndFollowingsContainer;