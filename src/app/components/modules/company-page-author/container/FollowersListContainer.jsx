"use client";
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import FollowersList from '../presentation/FollowersList';
import { getCompanyFollowers } from '@/app/services/connectionManagement';
import { blockUser } from '@/app/services/privacy';


/**
 * @namespace FollowersListContainer
 */

/**
 * A component that fetches and displays a list of followers for a given company.
 * Allows blocking users and redirects to user pages.
 *
 * @memberof FollowersListContainer
 * @param {Object} props - The component props.
 * @param {string} props.companyUsername - The username of the company whose followers are to be fetched.
 * @returns {JSX.Element} The rendered component.
 */

export default function FollowersListContainer({companyUsername}){
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    console.log("username in follower", companyUsername);

    useEffect(() => {
        const getFollowers = async () => {
        try {
            const data = await getCompanyFollowers(1, companyUsername);
            setFollowers(data);
            console.log("Fetched data:", data);
        } catch (err) {
            console.error(err);
            setError("Failed to load followers.");
        }
        };
        getFollowers();
    }, [companyUsername]);


    const handleBlockUser = useMutation({
    mutationFn: (username) => blockUser(username,false, companyUsername),
    onSuccess: (_, username) => {
        setFollowers(prev => prev.filter(user => user.username !== username));
        queryClient.invalidateQueries(["followers"]);
    },
    onError: (err) => {
        console.error("Failed to block user:", err);
        setError("Could not block user.");
    }
    });


    const block = (username) => {
        console.log("username in block", username)
        handleBlockUser.mutate(username);
    };
      

    const goToUserPage= (followers)=>{
        if (followers?.username) {
            router.push(`/u/${followers.username}`);
        }
    }

  return(
    <div>
        <FollowersList followers={followers} goToUserPage={goToUserPage} block={block} isBlocked={false} />
    </div>
  );
};