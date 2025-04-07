"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RecentSearches from "../presentation/RecentSearchesPresentation";


const RecentSearchesContainer = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramMapping = {
    keyword: "Keyword",
    location: "Location",
    industry: "Industry",
    company: "Company",
    jobType: "Job Type",
    experience: "Experience",
    salary: "Salary",
    remote: "Remote",
    postedDate: "Posted Date",
  };

  const parseSearchParams = useCallback((params) => {
    const result = {};
    for (const [key, label] of Object.entries(paramMapping)) {
      const value = params.get(key);
      if (value) result[label] = value;
    }
    params.forEach((value, key) => {
      if (!paramMapping[key]) {
        const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
        result[formattedKey] = value;
      }
    });
    return result;
  }, []);

  const getSearchLabel = useCallback((params) => {
    const parsed = parseSearchParams(params);
    const count = Object.keys(parsed).length;

    if (count === 0) return "All Jobs";
    if (count === 1) {
      const [key, value] = Object.entries(parsed)[0];
      if (["Keyword", "Company", "Industry"].includes(key)) return `${value.split(",")[0]} jobs`;
      if (key === "Location") return `Jobs in ${value.split(",")[0]}`;
      return `${key}: ${value}`;
    }

    const primary = parsed["Keyword"] || parsed["Location"] || parsed["Industry"] || parsed["Company"];
    return primary
      ? `${primary.split(",")[0]} +${count - 1} filter${count > 2 ? "s" : ""}`
      : `${count} filter${count !== 1 ? "s" : ""}`;
  }, [parseSearchParams]);

  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const hours = Math.floor((now - date) / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentJobSearches");
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load recent searches:", e);
      localStorage.removeItem("recentJobSearches");
    }
  }, []);

  useEffect(() => {
    const current = searchParams.toString();
    if (!current) return;

    const filters = parseSearchParams(searchParams);
    const newSearch = {
      query: current,
      label: getSearchLabel(searchParams),
      timestamp: Date.now(),
      filters,
    };

    setRecentSearches((prev) => {
      if (prev.some(s => s.query === current)) return prev;
      const updated = [newSearch, ...prev.filter(s => s.query !== current)].slice(0, 5);
      try {
        localStorage.setItem("recentJobSearches", JSON.stringify(updated));
      } catch (e) {
        console.error("Save failed:", e);
      }
      return updated;
    });
  }, [searchParams, getSearchLabel, parseSearchParams]);

  const handleSearchClick = (query) => {
    router.push(`/jobs?${query}`);
  };

  const handleClearOne = (index) => {
    const updated = [...recentSearches];
    updated.splice(index, 1);
    localStorage.setItem("recentJobSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const handleClearAll = () => {
    localStorage.removeItem("recentJobSearches");
    setRecentSearches([]);
  };

  return (
    <RecentSearches
      recentSearches={recentSearches}
      onSearchClick={handleSearchClick}
      onClearOne={handleClearOne}
      onClearAll={handleClearAll}
      formatTimestamp={formatTimestamp}
    />
  );
};

export default RecentSearchesContainer;
