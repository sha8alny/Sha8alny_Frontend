"use client";
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import FollowersList from '../presentation/FollowersList';
import { getFollowers } from '@/app/services/connectionManagement';
import { blockUser, unblockUser } from '@/app/services/privacy';

export default function FollowersListContainer({companyUsername}){
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    console.log("username in follower", companyUsername);

    useEffect(() => {
        const getCompanyFollowers = async () => {
        try {
            const data = await getFollowers(1, companyUsername);
            setFollowers(data);
            console.log("Fetched data:", data);
        } catch (err) {
            console.error(err);
            setError("Failed to load followers.");
        }
        };
        getCompanyFollowers();
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