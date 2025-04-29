"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";
import { followCompany, unfollowCompany } from "@/app/services/companyManagement";
import ProfileHeader from "../presentation/ProfileHeader";

/**
 * @namespace company-user
 * @module ProfileHeaderContainer
 */

/**
 * Determines the active tab based on the current pathname and
 * renders the `ProfileHeader` component with the fetched company data.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.userProfile - The username or identifier of the company/user profile
 * @returns {JSX.Element} The rendered `ProfileHeader` component
 *
 * @example
 * <ProfileHeaderContainer userProfile="exampleCompany" />
 */
/**
 * Checks if a given route slug is active (included in current pathname).
 * @param {string} slug - The route slug to check (e.g., "about-page")
 * @returns {boolean} True if slug is part of the pathname, else false
 */
/**
 * Fetches the company data based on the username/profile
 * and updates local state.
 * @async
 */

export default function ProfileHeaderContainer({ username }) {
    const pathname = usePathname();
    const isActive = (slug) => pathname.includes(slug);
    const [error, setError] = useState(null);
    const [company, setCompany] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(null);
    const router = useRouter();


    const handleFollowClick = async () => {
      try {
        const newIsFollowing = !isFollowing;
    
        if (newIsFollowing) {
          await followCompany(username);
        } else {
          await unfollowCompany(username);
        }
        setIsFollowing(newIsFollowing);
        setFollowerCount((prev) => prev + (newIsFollowing ? 1 : -1));
      } catch (err) {
        setError("Could not update follow status.");
      }
    };
    

    useEffect(() => {
      const fetchCompany = async () => {
        try {
          const data = await getCompany(username);
          setCompany(data);
          setIsFollowing(data.isFollowed || false);
          setFollowerCount(data.numFollowers || 0);
        } catch (err) {
          setError(err.message);
        }
      };
    
      if (username) fetchCompany();
    }, [username]);
    

    const visitWebsite = () =>{
      router.push(`/company/${username}/user/posts`);
    }

    const OpenCompanyAdminPage =() =>{
      router.push(`/company/${username}/admin/dashboard`);
    }
    
  return (
    <div>
      <ProfileHeader username={username} isActive={isActive} company={company} handleFollowClick={handleFollowClick} isFollowing={isFollowing} visitWebsite={visitWebsite} OpenCompanyAdminPage={OpenCompanyAdminPage} />
    </div>
  );
}