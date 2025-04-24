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
import { ScrollArea } from "@/app/components/ui/ScrollArea";

/**
 * @namespace jobs
 * @module jobs
 */

/**
 * SalaryRangeFilter component for selecting a salary range with a slider.
 */
function SalaryRangeFilter({ min = 0, max = 100000, onChange, value }) {
  const [localValues, setLocalValues] = useState([value?.min || min, value?.max || max]);
  const [values, setValues] = useState([value?.min || min, value?.max || max]);

  // Update local state while dragging without triggering onChange
  const handleDragging = (newValues) => {
    setLocalValues(newValues);
  };

  // Only trigger onChange when user releases the slider (committed)
  const handleCommitted = (newValues) => {
    setValues(newValues);
    onChange && onChange({ min: newValues[0], max: newValues[1] });
  };

  // Update component when value prop changes
  useEffect(() => {
    if (value && (value.min !== values[0] || value.max !== values[1])) {
      setValues([value.min, value.max]);
      setLocalValues([value.min, value.max]);
    }
  }, [value, max]);

  return (
    <div className="py-4 px-1">
      <div className="flex justify-between mb-4 text-sm text-muted-foreground">
        <span className="text-primary">${localValues[0].toLocaleString()}</span>
        <span className="text-primary">${localValues[1].toLocaleString()}</span>
      </div>
      <Slider
        value={localValues}
        max={max}
        min={min}
        step={1000}
        onValueChange={handleDragging}
        onValueCommit={handleCommitted}
        className="mb-6 text-accent"
        data-testid="salary-slider"
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
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            data-testid={`filter-section-toggle-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {isOpen ? (
              <ExpandLessIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ExpandMoreIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1 max-h-48">{children}</CollapsibleContent>
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
  filterType
}) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-2">Loading...</div>;
  }

  return (
    <div className="space-y-2 max-h-48">
      {options.map((option, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Checkbox
            id={`${filterType}-${i}`}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) onSelect(filterType, option);
              else onRemove({ type: filterType, value: option });
            }}
            data-testid={`checkbox-${filterType}-${option}`}
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
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.filters - Current filter values for various filter categories
 * @param {Array} props.selectedFilters - Active filters displayed as badges
 * @param {Object} props.options - Available options for each filter category
 * @param {boolean} props.isLoading - Loading state for filter data
 * @param {Function} props.onFilterChange - Callback when a filter is changed or selected
 * @param {Function} props.onRemoveFilter - Callback when a filter is removed
 * @param {Function} props.onClearAllFilters - Callback to clear all active filters
 */
function JobsFilterPresentation({
  filters,
  options,
  selectedFilters,
  isLoading,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
  filterSections ,
}) {


  // State for collapsible toggle on mobile only
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  return (
    
    <Card className="w-full bg-foreground gap-2 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FilterAltIcon className="h-5 w-5" />
            Filter Jobs
          </CardTitle>

          <div className="flex items-center gap-2">
            {selectedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllFilters}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                data-testid="clear-all-filters"
              >
                Clear all
              </Button>
            )}
            
            <Button 
              variant="ghost"
              size="sm" 
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="md:hidden h-8 flex items-center"
              data-testid="toggle-filters"
            >
              {isFilterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
          </div>
        </div>

        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
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
                  data-testid={`remove-filter-badge-${filter.type}-${filter.value}`}
                >
                  x
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <div className={`${isFilterExpanded ? 'block' : 'hidden'} md:block`}>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)] px-4 py-2"> 
            <div className="space-y-0">
              <FilterSection title="Search" className="pt-0">
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
              </FilterSection>

              <FilterSection title="Sort by Salary">
                <select
                  value={filters.sortBySalary || ""}
                  onChange={(e) => onFilterChange("sortBySalary", e.target.value)}
                  className="h-9 w-full border rounded px-2 text-sm bg-foreground"
                  data-testid="sort-by-salary-select"
                >
                  <option value="">Select</option>
                  <option value="asc">Lowest to Highest</option>
                  <option value="desc">Highest to Lowest</option>
                </select>
              </FilterSection>

              <FilterSection title="Salary Range">
                <SalaryRangeFilter
                  min={0}
                  max={options.maxSalary}
                  value={filters.salaryRange}
                  onChange={(value) => onFilterChange("salaryRange", value)}
                />
              </FilterSection>

              {filterSections?.map((section, i) => (
                <FilterSection
                  key={i}
                  title={section.title}
                  className={section.title === "Location Type" ? "border-b-0" : ""}
                >
                  <ScrollArea className="pr-1">
                    <CheckboxFilterList
                      options={section.options}
                      selected={section.selected}
                      isLoading={isLoading}
                      onSelect={onFilterChange}
                      onRemove={onRemoveFilter}
                      filterType={section.type}
                    />
                  </ScrollArea>
                </FilterSection>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </div>
    </Card>
  );
}

export default JobsFilterPresentation;