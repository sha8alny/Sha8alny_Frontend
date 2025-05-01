"use client"
import Home from "../presentation/Home";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";
import { getProfilePosts } from "@/app/services/post";

/**
 * @namespace company-user
 * @module HomeContainer
 */

/**
 * HomeContainer component - A container for the company profile's home page.
 *
 * This component is responsible for:
 * - Fetching company details using the provided `username`
 * - Fetching the company's posts
 * - Handling navigation to the about and posts pages
 *
 * It passes all required props to the `Home` presentation component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.username - The username or identifier for the company
 * @returns {JSX.Element} The rendered `Home` component with fetched data and navigation handlers
 *
 * @example
 * <HomeContainer username="acmeInc" />
 */

export default function HomeContainer({ username }) {
    const [company, setCompany] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const goToAboutPage = () => {
        router.push(`/company/${username}/user/about`);
    };

    const goToPostsPage = () => {
        router.push(`/company/${username}/user/posts`);
    };
    useEffect(() => {
        const fetchCompany = async () => {
        try {
            const data = await getCompany(username);
            setCompany(data);
        } catch (err) {
            setError(err.message);
        } finally{
            setLoading(false);
        }
        };

        if (username) fetchCompany();
    }, [username]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const myPosts = await getProfilePosts(1, username, true); 
                setPosts(myPosts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchPosts();
    }, [username]);

    return (
        <div>
            <Home company={company} posts={posts} goToAboutPage={goToAboutPage} goToPostsPage={goToPostsPage} loading={loading}/>
        </div>
    );
}