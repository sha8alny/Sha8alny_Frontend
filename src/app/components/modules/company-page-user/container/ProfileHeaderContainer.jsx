"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";
import { followCompany, unfollowCompany } from "@/app/services/companyManagement";
import ProfileHeader from "../presentation/ProfileHeader";
import { report } from "@/app/services/privacy";
import { useMutation  } from "@tanstack/react-query";

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
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blockUserModalOpen, setBlockUserModalOpen] = useState(false);
  const [reportUserModalOpen, setReportUserModalOpen] = useState(false);
  const [reportState, setReportState] = useState(0);
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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


  const handleFollowClick = async () => {
    if (!isFollowing) {
      try {
        await followCompany(username);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      } catch (err) {
        setError("Could not follow the company.");
      }
    } else {
      setShowUnfollowDialog(true);
    }
  };
    
  const handleDialogConfirm = async () => {
    try {
      await unfollowCompany(username);
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } catch (err) {
      setError("Could not update follow status.");
    } finally {
      setShowUnfollowDialog(false);
    }
  };

  const handleDialogCancel = () => {
    setShowUnfollowDialog(false);
  };

  const handleReportMutation = useMutation({
    mutationFn: (params) => {
      const { username, reportObj } = params;

      return report(null, null, username, null, null, reportObj);
    },
    onMutate: () => {
      setReportState(1);
    },
    onSuccess: () => {
      setReportState(2);
    },
    onError: (error) => {
      console.error("Error reporting post:", error);
      setReportState(3);
    },
    onSettled: () => {
      setTimeout(() => {
        setReportUserModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
    },
  });
  
  const handleReport = () => {
    console.log(username);
    if (!username) {
      console.error("Cannot report: username is missing or invalid.");
      setReportState(3);
      setTimeout(() => {
        setReportUserModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
      return;
    }

    const reportObj = {
      reason: reportType,
      text: reportType === "Something Else" ? reportText : null,
    };
    handleReportMutation.mutate({ username, reportObj });
  };

  const handleBlock = () => {
    if (!userProfile?.username) {
      console.error("Cannot block: username is missing or invalid.");
      return;
    }
    handleBlockMutation.mutate(userProfile?.username);
  };

  const visitWebsite = () =>{
    router.push(`/company/${username}/user/posts`);
  }

  const OpenCompanyAdminPage =() =>{
    router.push(`/company/${username}/admin/dashboard`);
  }
  
  return (
    <div>
      <ProfileHeader username={username} isActive={isActive} company={company} handleFollowClick={handleFollowClick} isFollowing={isFollowing} visitWebsite={visitWebsite} OpenCompanyAdminPage={OpenCompanyAdminPage} showUnfollowDialog={showUnfollowDialog} handleDialogConfirm={handleDialogConfirm} handleDialogCancel={handleDialogCancel} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} dropdownRef={dropdownRef} setReportUserModalOpen={setReportUserModalOpen} setBlockUserModalOpen={setBlockUserModalOpen} blockUserModalOpen={blockUserModalOpen} reportUserModalOpen={reportUserModalOpen} reportState={reportState} reportText={reportText} reportType={reportType} setReportText={setReportText} setReportType={setReportType} onReport={handleReport} onBlock={handleBlock} />
    </div>
  );
}