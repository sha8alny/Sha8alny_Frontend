"use client";
import { useState, useEffect } from "react";
import { fetchBlockedUsers } from "@/app/services/privacy";
import FollowersList from "../presentation/FollowersList";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unblockUser } from '@/app/services/privacy';

export default function BlockedFollowersContainer({companyUsername}){
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    useEffect(() => {
            const getBlockedFollowers = async () => {
            try {
                const data = await fetchBlockedUsers("", 1 , 10, companyUsername);
                setFollowers(data.blockedUsers);
                console.log("Fetched blocked data:", data);
            } catch (err) {
                console.error(err);
                setError("Failed to load followers.");
            }
            };
            getBlockedFollowers();
    }, [companyUsername]);

    const handleUnblockUser = useMutation({
        mutationFn: (username) => unblockUser(username,false, companyUsername),
        onSuccess: (_,username) => {
            setFollowers(prev => prev.filter(user => user.username !== username));
            queryClient.invalidateQueries(["followers"]);
        },
        onError: (err) => {
            console.error("Failed to unblock user:", err);
            setError("Could not unblock user.");
        }
    });

    const unblock = (username) => {
        console.log("username in unblock", username)
        handleUnblockUser.mutate(username);
    };

    return(
        <div>
            <FollowersList followers={followers} unblock={unblock} isBlocked={true}/>
        </div>
    );
}