"use client"
import Home from "../presentation/Home";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";
import { getProfilePosts } from "@/app/services/post";
import { getCompanyId } from "@/app/services/companyManagement";

/**
 * HomeContainer component - Handles data fetching and navigation for the Home page.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.username - The username used to fetch company and post data.
 * @returns {JSX.Element} The rendered component.
 */

export default function HomeContainer({ username }) {
    const [company, setCompany] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    const goToAboutPage = () => {
        router.push(`/company-user-admin/${username}/about-page`);
    };

    const goToPostsPage = () => {
        router.push(`/company-user-admin/${username}/posts-page`);
    };
    useEffect(() => {
        const fetchCompany = async () => {
        try {
            const data = await getCompany(username);
            setCompany(data);
        } catch (err) {
            setError(err.message);
        } 
        };

        if (username) fetchCompany();
    }, [username]);

    useEffect(() => {
        const fetchPosts = async () => {
        const response = await getCompanyId(username);
        console.log("Response from getCompanyId:", response); // Debugging line
        const { companyId } = response;
        console.log("Company ID:", companyId);
            try {
                const myPosts = await getProfilePosts(1, companyId, true); // assuming page 1 for now
                console.log("Fetched posts:", myPosts); 
                setPosts(myPosts);
            } catch (err) {
                setError(err.message);
            }
        };
        if (username) fetchPosts();
    }, [username]);

    return (
        <div>
            <Home company={company} posts={posts} goToAboutPage={goToAboutPage} goToPostsPage={goToPostsPage}/>
        </div>
    );
}