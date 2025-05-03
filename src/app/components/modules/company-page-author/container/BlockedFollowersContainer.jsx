"use client";
import { useState, useEffect } from "react";
import { fetchBlockedUsers } from "@/app/services/privacy";
import FollowersList from "../presentation/FollowersList";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unblockUser } from '@/app/services/privacy';

/**
 * @namespace BlockedFollowers
 */

/**
 * A component that fetches and displays a list of blocked followers for a given company.
 * Allows unblocking a user and updating the UI accordingly.
 *
 * @memberof BlockedFollowers
 * @param {Object} props - The component props.
 * @param {string} props.companyUsername - The username of the company whose blocked followers are to be fetched.
 * @returns {JSX.Element} The rendered component.
 */

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