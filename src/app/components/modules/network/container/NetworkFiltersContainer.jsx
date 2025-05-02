"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUser } from "@/app/services/search";
import NetworkFilter from "../presentation/NetworkFilters";
import { act } from "react";
import { useFilters } from "@/app/context/NetworkFilterContext";

const NetworkFilterContainer = ({activeTab}) => {
  const {filters, setFilters}= useFilters();
  
  const [tempName, setTempName] = useState(filters.name);
  const [tempIndustry, setTempIndustry] = useState(filters.industry);
  const [tempLocation, setTempLocation] = useState(filters.location);


  useEffect(() => {
    setTempName(filters.name);
    setTempIndustry(filters.industry);
    setTempLocation(filters.location);
  }, [filters]);

  const updateFilter = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,[field]: value,
    }));
  }
    const shouldShowConnectionDegree =
    activeTab === "followers&followings" || activeTab === "pending";
  return (
    <NetworkFilter
        filters={filters}
        tempName={tempName}
        setTempName={setTempName}
        tempIndustry={tempIndustry}
        setTempIndustry={setTempIndustry}
        tempLocation={tempLocation}
        setTempLocation={setTempLocation}
        shouldShowConnectionDegree={shouldShowConnectionDegree}
        updateFilter={updateFilter}
      />
    

  );
};

export default NetworkFilterContainer;