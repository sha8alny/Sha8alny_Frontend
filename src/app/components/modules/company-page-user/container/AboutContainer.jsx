"use client"
import { useEffect, useState } from "react";
import About from "../presentation/About";
import { getCompany } from "@/app/services/companyManagement";
import { useRouter } from "next/navigation";

/**
 * @namespace AboutContainer
 * @component
 * 
 * A container component that fetches and displays company information based on a given username. 
 * Handles loading and error states and passes the company data to the `About` component.
 */

/**
 * AboutContainer component - Fetches company data from an API and renders the About component.
 *
 * @param {AboutContainer.Props} props - The component props.
 * @param {string} props.username - The username for which to fetch the company information.
 * 
 * @returns {JSX.Element} The rendered AboutContainer component.
 */
/**
 * @namespace AboutContainer
 */

/**
 * @typedef {Object} AboutContainer.Props
 * @property {string} username - The username for which to fetch the company information.
 */

export default function AboutContainer({ username }) {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCompany = async () => {
        try {
            const data = await getCompany(username);
            setCompany(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        if (username) fetchCompany();
    }, [username]);


    const goToCompanyPage = () => { 
        router.push(`/company/${username}/user/home`);
    }
    return (
        <div>
            <About company={company} goToCompanyPage={goToCompanyPage} loading={loading} error={error} />
        </div>
    );
}