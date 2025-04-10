"use client"
import { useEffect, useState } from "react";
import About from "../presentation/About";
import { getCompany } from "@/app/services/companyManagment";

/**
 * AboutContainer component
 * 
 * This component fetches and displays company information associated with a given username.
 * It handles loading, error, and success states, and renders the <About /> presentation component accordingly.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.username - The username used to fetch the corresponding company data
 * @returns {JSX.Element} The rendered component with conditional UI based on fetch state
 */

/**
 * @typedef {Object} Company
 * @property {string} name - The name of the company
 * @property {string} [description] - Optional description of the company
 * @property {string} [industry] - Optional industry sector
 * // Add more fields here depending on what getCompany returns
 */

/**
 * Fetches company data based on the provided username.
 * Sets appropriate loading and error states.
 *
 * @async
 * @function fetchCompany
 * @returns {Promise<void>}
 */
/** @type {[Company|null, Function]} */
/** @type {[boolean, Function]} */
/** @type {[string|null, Function]} */

export default function AboutContainer({ username }) {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p className="p-4">Loading company info...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
    return (
        <div>
            <About company={company} />
        </div>
    );
}