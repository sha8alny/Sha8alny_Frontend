"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUser } from "@/app/services/search";
import NetworkFilter from "../presentation/NetworkFilters";
import { act } from "react";
import { useFilters } from "@/app/context/NetworkFilterContext";

/**
 * Container component for managing and displaying network filters.
 * Handles state management, filter updates, and passes data to the `NetworkFilters` presentation component.
 *
 * @namespace network
 * @module network
 * @component
 *
 * @param {Object} props - The component props.
 * @param {string} props.activeTab - The currently active tab (e.g., "followers", "following").
 *
 * @returns {JSX.Element} The container component for network filters.
 */

const NetworkFilterContainer = ({activeTab}) => {
    /**
   * Filters context for managing network filters.
   * @type {Object}
   * @property {string} name - The name filter for the network.
   * @property {string} industry - The industry filter for the network.
   * @property {string} location - The location filter for the network.
   * @property {Function} setFilters - Function to update the filters.
   */
  const {filters, setFilters}= useFilters();
    /**
   * Temporary state for the name filter.
   * Used for managing the input field before applying the filter.
   * @type {string}
   */
  const [tempName, setTempName] = useState(filters.name);
    /**
   * Temporary state for the industry filter.
   * Used for managing the input field before applying the filter.
   * @type {string}
   */
  const [tempIndustry, setTempIndustry] = useState(filters.industry);
    /**
   * Temporary state for the location filter.
   * Used for managing the input field before applying the filter.
   * @type {string}
   */
  const [tempLocation, setTempLocation] = useState(filters.location);
  /**
   * Effect to synchronize the temporary filter states with the global filters.
   * Updates the temporary states whenever the global filters change.
   */

  useEffect(() => {
    setTempName(filters.name);
    setTempIndustry(filters.industry);
    setTempLocation(filters.location);
  }, [filters]);
    /**
   * Updates a specific filter field in the global filters context.
   *
   * @param {string} field - The filter field to update (e.g., "name", "industry", "location").
   * @param {string} value - The new value for the filter field.
   */

  const updateFilter = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,[field]: value,
    }));
  }
    /**
   * Determines whether the connection degree filter should be displayed.
   * @type {boolean}
   */
    const shouldShowConnectionDegree =
    activeTab === "followers&followings" || activeTab === "pending";
    const showFirstDegree = 
      activeTab === "followers&followings";
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
        showFirstDegree={showFirstDegree}
      />
    

  );
};

export default NetworkFilterContainer;