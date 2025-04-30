"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FollowersList from '../presentation/FollowersList';
import { getFollowers } from '@/app/services/connectionManagement';

export default function FollowersListContainer({username}){
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const getCompanyFollowers = async () => {
        try {
            const data = await getFollowers(1, 10, username);
            setFollowers(data);
            console.log("Fetched data:", data);
        } catch (err) {
            console.error(err);
            setError("Failed to load followers.");
        }
        };
        getCompanyFollowers();
    }, [username]);

    const filteredFollowers = followers.filter(follower =>
        follower.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const goToUserPage= (followers)=>{
        if (followers?.username) {
            router.push(`/u/${followers.username}`);
          }
    }

  return(
    <div>
        <FollowersList followers={followers} goToUserPage={goToUserPage} filteredFollowers={filteredFollowers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );
};