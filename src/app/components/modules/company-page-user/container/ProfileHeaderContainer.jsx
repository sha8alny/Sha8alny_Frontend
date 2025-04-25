"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";
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

export default function ProfileHeaderContainer({ userProfile }) {
    const pathname = usePathname();
    const isActive = (slug) => pathname.includes(slug);
    const [error, setError] = useState(null);
    const [company, setCompany] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(company?.followers || 0);
    const router = useRouter();

    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => prev + (isFollowing ? -1 : 1));
    };
    useEffect(() => {
        const fetchCompany = async () => {
        try {
          const data = await getCompany(userProfile);
          setCompany(data);
        } catch (err) {
          setError(err.message);
        }
        };
        if (userProfile) fetchCompany();
    }, [userProfile]);

    const visitWebsite = () =>{
      router.push(`/company/${userProfile}/user/posts`);
    }

    const OpenCompanyAdminPage =() =>{
      router.push(`/company/${userProfile}/admin/dashboard`);
    }
    
  return (
    <div>
      <ProfileHeader userProfile={userProfile} isActive={isActive} company={company} handleFollowClick={handleFollowClick} isFollowing={isFollowing} visitWebsite={visitWebsite} OpenCompanyAdminPage={OpenCompanyAdminPage} />
    </div>
  );
}