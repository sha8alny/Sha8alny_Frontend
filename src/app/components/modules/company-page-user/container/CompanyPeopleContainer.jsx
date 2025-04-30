"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyPeople } from "@/app/services/companyManagement";
import { connectUser } from "@/app/services/connectionManagement";
import CompanyPeople from "../presentation/CompanyPeople";
import { deleteConnection, requestConnection } from "@/app/services/connectionManagement";

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
    const [connectedPeople, setConnectedPeople] = useState({});
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

    const handleConnectPerson = async (person) => {
        try {
            await connectUser(person.username);
            setConnectedPeople((prevState) => ({...prevState, [person.username]: true,  }));
            console.log(`Connected with ${person.username}`);
        } catch (err) {
            console.log(`Failed to connect with ${person.username}: ${err.message}`);
        }
    };

    const handleAcceptConnection = async (person) => {
        try {
            await requestConnection(person.username, "accepted");
            setConnectedPeople((prev) => ({ ...prev, [person.username]: true }));
            console.log(`Accepted connection with ${person.username}`);
        } catch (err) {
            console.log(`Failed to accept connection: ${err.message}`);
        }
    };
    
    const handleDeclineConnection = async (person) => {
        try {
            await requestConnection(person.username, "declined");
            console.log(`Declined connection from ${person.username}`);
        } catch (err) {
            console.log(`Failed to decline connection: ${err.message}`);
        }
    };

    
    const handleDeleteConnection = async (person) => {
        try {
            await deleteConnection(person.username);
            setConnectedPeople((prevState) => {
                const newState = { ...prevState };
                delete newState[person.username];  // Remove the user from the connectedPeople state
                return newState;
            });
            console.log(`Disconnected from ${person.username}`);
        } catch (err) {
            console.log(`Failed to disconnect from ${person.username}: ${err.message}`);
        }
    };

    const goToPeoplePage = (person) => {
        if (person?.username) {
          router.push(`/u/${person.username}`);
        }
    };
      
    
    console.log("connected people", connectedPeople);
  return (
      <div className="flex flex-wrap gap-6 bg-foreground rounded-lg">
        <CompanyPeople people={people} goToPeoplePage={goToPeoplePage} handleConnectPerson={handleConnectPerson} connectedPeople={connectedPeople} handleDeleteConnection={handleDeleteConnection} handleAcceptConnection={handleAcceptConnection} handleDeclineConnection={handleDeclineConnection}   />
      </div>
  );
}
