/**
 * Utilities for handling job filters
 */

/**
 * Parses URL search parameters into a filter object
 * @param {URLSearchParams} params - URL search parameters
 * @returns {Object} Filter object with all filter values
 */
export function parseUrlToFilters(params) {
    // Only apply filters if we're on the jobs page
    const pathname = window.location.pathname;
    if (pathname !== '/jobs') {
        return getDefaultFilters();
    }
    
    return {
        keyword: params.get("keyword") || "",
        location: params.get("location")?.split(",").filter(Boolean) || [],
        industry: params.get("industry")?.split(",").filter(Boolean) || [],
        experienceLevel: params.get("experience")?.split(",").filter(Boolean) || [],
        company: params.get("company")?.split(",").filter(Boolean) || [],
        salaryRange: {
            min: parseInt(params.get("minSalary") || "0", 10),
            max: parseInt(params.get("maxSalary") || "100000", 10),
        },
        employmentType: params.get("employmentType")?.split(",").filter(Boolean) || [],
        workLocation: params.get("workLocation")?.split(",").filter(Boolean) || [],
        sortBySalary: params.get("sortBySalary") || "",
    };
}
  
  /**
   * Converts filter object to URL search parameters
   * @param {Object} filters - Filter object
   * @returns {URLSearchParams} URL search parameters object
   */
  export function filtersToUrlParams(filters) {
    const params = new URLSearchParams();
  
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.location.length) params.set("location", filters.location.join(","));
    if (filters.industry.length) params.set("industry", filters.industry.join(","));
    if (filters.experienceLevel.length) params.set("experience", filters.experienceLevel.join(","));
    if (filters.company.length) params.set("company", filters.company.join(","));
    if (filters.employmentType.length) params.set("employmentType", filters.employmentType.join(","));
    if (filters.salaryRange.min > 0) params.set("minSalary", filters.salaryRange.min.toString());
    if (filters.salaryRange.max < 100000) params.set("maxSalary", filters.salaryRange.max.toString());
    if (filters.workLocation.length) params.set("workLocation", filters.workLocation.join(","));
    if (filters.sortBySalary) params.set("sortBySalary", filters.sortBySalary);
  
    return params;
  }

  export function formatFiltersForApi(filters) {
    const formatted = {};
  
    if (filters.keyword) formatted.keyword = filters.keyword;
    if (filters.location.length) formatted.location = filters.location.join(',');
    if (filters.industry.length) formatted.industry = filters.industry.join(',');
    if (filters.experienceLevel.length) formatted.experience = filters.experienceLevel.join(',');
    if (filters.company.length) formatted.company = filters.company.join(',');
    if (filters.employmentType.length) formatted.employmentType = filters.employmentType.join(',');
    if (filters.salaryRange.min > 0) formatted.minSalary = filters.salaryRange.min;
    if (filters.salaryRange.max < 100000) formatted.maxSalary = filters.salaryRange.max;
    if (filters.workLocation.length) formatted.workLocation = filters.workLocation.join(',');
    if (filters.sortBySalary) formatted.sortBySalary = filters.sortBySalary;
  
    return formatted;
  }
  
  /**
   * Creates an array of selected filters for display
   * @param {Object} filters - Current filter values
   * @returns {Array} Array of selected filter objects with type and value
   */
  export function createSelectedFiltersArray(filters) {
    const selected = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((val) => selected.push({ type: key, value: val }));
      } else if (key === "keyword" && value) {
        selected.push({ type: key, value });
      } else if (key === "salaryRange" && (value.min > 0 || value.max < 100000)) {
        selected.push({
          type: key,
          value: `$${value.min.toLocaleString()} - $${value.max.toLocaleString()}`,
        });
      } else if (key === "sortBySalary" && value) {
        selected.push({
          type: key,
          value: value === "asc" ? "Salary: Low to High" : "Salary: High to Low"
        });
      }
    });
    
    return selected;
  }
  
  /**
   * Get default filter values
   * @returns {Object} Default filter object
   */
  export function getDefaultFilters() {
    return {
      keyword: "",
      location: [],
      industry: [],
      experienceLevel: [],
      company: [],
      salaryRange: { min: 0, max: 100000 },
      employmentType: [],
      workLocation: [],
      sortBySalary: "",
    };
  }
  
  /**
   * Get default filter options
   * @returns {Object} Default filter options
   */
  export function getDefaultFilterOptions() {
    return {
      location: [],
      industry: [],
      experienceLevel: [],
      company: [],
      employmentType: ["Full-time", "Part-time", "Internship"],
      workLocation: ["Remote", "Onsite", "Hybrid"],
    };
  }