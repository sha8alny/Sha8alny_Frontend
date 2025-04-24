"use client";
import { useEffect, useState } from "react";
import { fetchCompanyPeople } from "@/app/services/companyManagement";
import CompanyPeople from "../presentation/CompanyPeople";

export default function CompanyPeopleContainer({username}) {
    const [people, setPeople] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCompanyPeople = async () => {
            try {
                console.log("hi")
                const data = await fetchCompanyPeople(username);
                console.log("people data", data);
                setPeople(data.people);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            };
        if (username) getCompanyPeople();
    }, [username]); 
  return (
    <div className="p-6 bg-foreground rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-text">People you may know</h2>
      <div className="flex flex-wrap gap-6">
        {people.map((people, index) => (
          <CompanyPeople key={index} people={people} />
        ))}
      </div>
    </div>
  );
}
