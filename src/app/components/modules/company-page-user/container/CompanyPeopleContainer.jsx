"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyPeople } from "@/app/services/companyManagement";
import { connectUser } from "@/app/services/connectionManagement";
import CompanyPeople from "../presentation/CompanyPeople";

/**
 * @namespace company-user
 * @module CompanyPeopleContainer
 */

/**
 * Container component that fetches and displays the list of people working at a specific company.
 * 
 * Fetches company people data using the provided `username`, manages loading and error states,
 * and passes the result to the `CompanyPeople` presentational component.
 *
 * This component runs only on the client side (using `"use client"` directive).
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.username - The username/identifier of the company
 * @returns {JSX.Element} A styled wrapper that contains the rendered `CompanyPeople` component
 *
 * @example
 * <CompanyPeopleContainer username="exampleCompany" />
 */

export default function CompanyPeopleContainer({username}) {
    const [people, setPeople] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getCompanyPeople = async () => {
            try {
                console.log("hi")
                const data = await fetchCompanyPeople(username);
                setPeople(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            };
        if (username) getCompanyPeople();
    }, [username]); 

    const goToPeoplePage = (person) => {
        if (person?.username) {
          router.push(`/u/${person.username}`);
        }
    };
      
    

  return (
      <div className="flex flex-wrap gap-6 bg-foreground rounded-lg">
        <CompanyPeople people={people} goToPeoplePage={goToPeoplePage} />
      </div>
  );
}
