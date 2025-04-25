'use client';
import SuggestedPages from "../presentation/SuggestedPages";
import { useRouter } from "next/navigation";
import { getCompanies } from "@/app/services/companyManagement";
import { useState, useEffect } from "react";

/**
 * @namespace company-user
 * @module SuggestedPagesContainer
 */

/**
 * SuggestedPagesContainer component - A container component responsible for fetching
 * and displaying a list of suggested company pages.
 *
 * This component:
 * - Retrieves a list of companies related to the provided username
 * - Handles navigation to the company's profile page
 * - Passes the fetched data and click handler to the `SuggestedPages` presentation component
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.username - The username used to fetch suggested companies
 * @param {string} props.title - The title to be displayed above the list of suggested pages
 *
 * @returns {JSX.Element} The rendered `SuggestedPages` component with fetched data and navigation behavior
 *
 * @example
 * <SuggestedPagesContainer username="acmeInc" title="Suggested Pages" />
 */

export default function SuggestedPagesContainer({username, title }) {
  const [companies, setCompanies]= useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies(username);
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          setCompanies([]); // fallback to empty array
          console.warn("Expected array, got:", data);
        }
      } catch (err) {
        setError(err.message);
      }
    };  
    if (username) fetchCompanies();
  }, [username]);
  
  const navigateToProfile = (username) => {
    router.push(`/company/${username}/user/posts`);
  };

  return <SuggestedPages title={title} pages={companies || []} onClick={navigateToProfile} />;
}
