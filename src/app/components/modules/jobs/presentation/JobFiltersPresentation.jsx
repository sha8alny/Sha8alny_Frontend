import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Slider } from "@/app/components/ui/Slider";
import { Checkbox } from "@/app/components/ui/CheckBox";
import { Label } from "@/app/components/ui/Label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/Collapsible";
import { Input } from "@/app/components/ui/Input";
/**
 * @namespace jobs
 * @module jobs
 */
/**
 * SalaryRangeFilter component for selecting a salary range with a slider.
 */
function SalaryRangeFilter({ min = 0, max = 100000, onChange, value }) {
  const [values, setValues] = useState([value?.min || min, value?.max || max]);

  const handleChange = (newValues) => {
    setValues(newValues);
    onChange && onChange({ min: newValues[0], max: newValues[1] });
  };

  // Update component when value prop changes
  useEffect(() => {
    if (value && (value.min !== values[0] || value.max !== values[1])) {
      setValues([value.min, value.max]);
    }
  }, [value]);

  return (
    <div className="py-4 px-1">
      <div className="flex justify-between mb-4 text-sm text-muted-foreground">
        <span className="text-primary">${values[0].toLocaleString()}</span>
        <span className="text-primary">${values[1].toLocaleString()}</span>
      </div>
      <Slider
        value={values}
        max={max}
        min={min}
        step={1000}
        onValueChange={handleChange}
        className="mb-6 text-accent"
      />
    </div>
  );
}

/**
 * FilterSection component for collapsible sections in the filter sidebar.
 */
function FilterSection({ title, children, className = "" }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`${className} border-b pb-3`}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between py-2 cursor-pointer group">
          <h3 className="text-sm font-medium">{title}</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? (
              <ExpandLessIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ExpandMoreIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1">{children}</CollapsibleContent>
    </Collapsible>
  );
}

/**
 * CheckboxFilterList component for rendering checkbox filter options
 */
function CheckboxFilterList({ 
  options, 
  selected = [], 
  isLoading, 
  onSelect, 
  onRemove,
  filterType,
  maxHeight = true
}) {
  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        Loading...
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${maxHeight ? 'max-h-48 overflow-y-auto pr-1' : ''}`}>
      {options.map((option, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Checkbox
            id={`${filterType}-${i}`}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) onSelect(filterType, option);
              else onRemove({ type: filterType, value: option });
            }}
          />
          <Label
            htmlFor={`${filterType}-${i}`}
            className="text-sm font-normal cursor-pointer"
          >
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
}

/**
 * JobsFilterPresentation component displays filter options for job listings.
 */
/**
 * A presentational component for job filtering functionality.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.filters - Current filter values for various filter categories
 * @param {Object} props.filters.keyword - Search keyword for job title, skills, etc.
 * @param {string|null} props.filters.sortBySalary - Salary sort direction ('asc', 'desc', or '')
 * @param {Array|Object} props.filters.salaryRange - Min and max salary range values
 * @param {Array} props.filters.location - Selected location filters
 * @param {Array} props.filters.industry - Selected industry filters
 * @param {Array} props.filters.experienceLevel - Selected experience level filters
 * @param {Array} props.filters.company - Selected company filters
 * @param {Array} props.filters.employmentType - Selected employment type filters
 * @param {Array} props.filters.workLocation - Selected work location type filters
 * @param {Object} props.options - Available options for each filter category
 * @param {Array} props.options.location - Available location options
 * @param {Array} props.options.industry - Available industry options
 * @param {Array} props.options.experienceLevel - Available experience level options
 * @param {Array} props.options.company - Available company options
 * @param {Array} props.options.employmentType - Available employment type options
 * @param {Array} props.options.workLocation - Available work location type options
 * @param {Array} props.selectedFilters - Active filters displayed as badges
 * @param {boolean} props.isLoading - Loading state for filter data
 * @param {Function} props.onFilterChange - Callback when a filter is changed or selected
 * @param {Function} props.onRemoveFilter - Callback when a filter is removed
 * @param {Function} props.onClearAllFilters - Callback to clear all active filters
 * @returns {JSX.Element} A job filters card component
 */
function JobsFilterPresentation({
  filters,
  options,
  selectedFilters,
  isLoading,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
}) {
  return (
    <Card className="w-full bg-foreground">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FilterAltIcon className="h-5 w-5" />
            Filter Jobs
          </CardTitle>

          {selectedFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          )}
        </div>

        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="primary"
                className="px-2 py-1 text-xs border-2"
              >
                {filter.value}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFilter(filter)}
                  className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-destructive"
                >
                  x
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-0">
        <FilterSection title="Search" className="pt-0">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Job title, skills, or keywords"
              value={filters.keyword}
              onChange={(e) => onFilterChange("keyword", e.target.value, false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onFilterChange("keyword", e.target.value, true);
                }
              }}
              onBlur={(e) => onFilterChange("keyword", e.target.value, true)}
              className="h-9"
            />
          </div>
        </FilterSection>
        
        <FilterSection title="Sort by Salary">
          <div className="space-y-2">
            <select
              value={filters.sortBySalary || ""}
              onChange={(e) => onFilterChange("sortBySalary", e.target.value)}
              className="h-9 w-full border rounded px-2 text-sm"
            >
              <option value="">Select</option>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>
          </div>
        </FilterSection>
        
        <FilterSection title="Salary Range">
          <SalaryRangeFilter
            min={0}
            max={100000}
            value={filters.salaryRange}
            onChange={(value) => onFilterChange("salaryRange", value)}
          />
        </FilterSection>

        <FilterSection title="Location">
          <CheckboxFilterList
            options={options.location}
            selected={filters.location}
            isLoading={isLoading}
            onSelect={onFilterChange}
            onRemove={onRemoveFilter}
            filterType="location"
          />
        </FilterSection>

        <FilterSection title="Industry">
          <CheckboxFilterList
            options={options.industry}
            selected={filters.industry}
            isLoading={isLoading}
            onSelect={onFilterChange}
            onRemove={onRemoveFilter}
            filterType="industry"
          />
        </FilterSection>

        <FilterSection title="Experience Level">
          <CheckboxFilterList
            options={options.experienceLevel}
            selected={filters.experienceLevel}
            isLoading={isLoading}
            onSelect={onFilterChange}
            onRemove={onRemoveFilter}
            filterType="experienceLevel"
          />
        </FilterSection>

        <FilterSection title="Company">
          <CheckboxFilterList
            options={options.company}
            selected={filters.company}
            isLoading={isLoading}
            onSelect={onFilterChange}
            onRemove={onRemoveFilter}
            filterType="company"
          />
        </FilterSection>

        <FilterSection title="Employment Type">
          <CheckboxFilterList
            options={options.employmentType}
            selected={filters.employmentType}
            isLoading={false}
            onSelect={onFilterChange}
            onRemove={onRemoveFilter}
            filterType="employmentType"
            maxHeight={false}
          />
        </FilterSection>

        <FilterSection title="Location Type" className="border-b-0">
          <CheckboxFilterList
            options={options.workLocation}
            selected={filters.workLocation}
            isLoading={false}
            onSelect={onFilterChange}
            onRemove={onRemoveFilter}
            filterType="workLocation"
            maxHeight={false}
          />
        </FilterSection>
      </CardContent>
    </Card>
  );
}

export default JobsFilterPresentation;