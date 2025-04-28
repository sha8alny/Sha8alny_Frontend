"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUser } from "@/app/services/search";
import NetworkFilter from "../presentation/NetworkFilters";
import { act } from "react";

const NetworkFilterContainer = ({activeTab, onResults}) => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const [nameFilter, setNameFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const keyword = nameFilter == ""? searchParams.get("keyword"): nameFilter;
  const [connectionDegree, setConnectionDegree] = useState("");
  
  const [tempName, setTempName] = useState(nameFilter);
  const [tempIndustry, setTempIndustry] = useState(industryFilter);
  const [tempLocation, setTempLocation] = useState(locationFilter);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setTempName(nameFilter);
    setTempIndustry(industryFilter);
    setTempLocation(locationFilter);
  }, [nameFilter, industryFilter, locationFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [ activeTab]);
  
  
  const queryFn = () => {
    return searchUser(
        keyword,
         industryFilter,
          locationFilter,
           activeTab==="followers&followings" || activeTab==="pending"? connectionDegree: "",
            currentPage,
             9);
  };

  const {
    data: results,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: [
      "search",
      keyword,
      industryFilter,
      locationFilter,
      connectionDegree,
      currentPage
    ],
    queryFn,
    retry:1,
    keepPreviousData: true,
  });


    useEffect(() => {
    const checkHasMore = async() => {
        if (results && results.length === 9) {
            try {
                const nextPageData = await searchUser(
                    keyword,
                    industryFilter,
                    locationFilter,
                    activeTab==="followers&followings" || activeTab==="pending"? connectionDegree: "",
                    currentPage+1,
                    9
                );
                setHasMore(nextPageData.length > 0);
            } catch (error) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
    };
        checkHasMore();
    }, [results, currentPage, keyword, industryFilter, locationFilter, connectionDegree, activeTab]);

    const nextPage = () => {
        if (hasMore) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }
    useEffect(() => {
        if (results && results.length > 0) {
            onResults({
                results: results || [],
                isLoading,
                page: currentPage,
                hasMore,
                nextPage: nextPage,
                prevPage: prevPage
            })
        }
    }, [results, onResults, currentPage, hasMore, nextPage, prevPage]);

    const shouldShowConnectionDegree =
    activeTab === "followers&followings" || activeTab === "pending";
  return (
    <NetworkFilter
        tempName={tempName}
        setTempName={setTempName}
        tempIndustry={tempIndustry}
        setTempIndustry={setTempIndustry}
        tempLocation={tempLocation}
        setTempLocation={setTempLocation}
        connectionDegree={connectionDegree}
        setNameFilter={setNameFilter}
        setIndustryFilter={setIndustryFilter}
        setLocationFilter={setLocationFilter}
        setConnectionDegree={setConnectionDegree}
        shouldShowConnectionDegree={shouldShowConnectionDegree}
      />
    

  );
};

export default NetworkFilterContainer;