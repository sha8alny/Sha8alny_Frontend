"use client";
import { Filter } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select";
import React from "react";

const UserFilters = ({
    tempName,
    setTempName,
    tempIndustry,
    setTempIndustry,
    tempLocation,
    setTempLocation,
    connectionDegree,
    setNameFilter,
    setIndustryFilter,
    setLocationFilter,
    setConnectionDegree,
    shouldShowConnectionDegree,
  }) => (
    <div className="bg-foreground p-4 rounded-lg shadow border h-fit w-full top-20">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="text-md font-semibold text-primary">Filters</h3>
      </div>
  
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Name
          </label>
          <Input
            key="name-filter-input"
            placeholder="Enter name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setNameFilter(tempName);
              }
            }}
            onBlur={() => setNameFilter(tempName)}
            className="h-9 w-full text-primary"
            data-testid="user-name-filter-input"
          />
        </div>
  
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Industry
          </label>
          <Input
            key="industry-filter-input"
            placeholder="Enter industry"
            value={tempIndustry}
            onChange={(e) => setTempIndustry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIndustryFilter(tempIndustry);
              }
            }}
            onBlur={() => setIndustryFilter(tempIndustry)}
            className="h-9 w-full text-primary"
            data-testid="user-industry-filter-input"
          />
        </div>
  
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Location
          </label>
          <Input
            key="location-filter-input-user"
            placeholder="Enter location"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLocationFilter(tempLocation);
              }
            }}
            onBlur={() => setLocationFilter(tempLocation)}
            className="h-9 w-full text-primary"
            data-testid="user-location-filter-input"
          />
        </div>
        {shouldShowConnectionDegree && (
        <div className="space-y-2 w-full">
          <label className="text-xs font-medium text-muted-foreground">
            Connection
          </label>
          <Select
            value={connectionDegree}
            onValueChange={setConnectionDegree}
            data-testid="user-connection-select"
          >
            <SelectTrigger className="h-9 w-full" data-testid="user-connection-trigger">
              <SelectValue placeholder="Connection degree" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={2} data-testid="user-connection-2nd">2nd Degree</SelectItem>
              <SelectItem value={3} data-testid="user-connection-3rd">3rd Degree</SelectItem>
            </SelectContent>
          </Select>
        </div>
        )}
      </div>
      
    </div>
  );

export default UserFilters;