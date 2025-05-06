import { Input } from "@/app/components/ui/Input";
import { Checkbox } from "@/app/components/ui/CheckBox";
import { Textarea } from "@/app/components/ui/Textarea";
import { Label } from "@/app/components/ui/Label";
import { X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import AddButton from "@/app/components/ui/AddButton";

/**
 * @namespace profile
 * @module profile
 */
/**
 * ModExperiencePresentation - Multi-stage form for managing work experience entries
 * 
 * This component renders a comprehensive four-stage form interface for adding or editing
 * professional experience information. It includes validation, form navigation, and status indicators.
 * 
 * The form progresses through these stages:
 * 1. Basic Information - Job title, company, location, employment type
 * 2. Time Period - Start and end dates with option for current position
 * 3. Additional Details - Job description and related skills
 * 4. Review - Final review of all information before submission
 * 
 * @param {Object} props - Component props
 * @param {Object} props.form - Form object from form library
 * @param {Function} props.handleFormSubmit - Function to process form submission
 * @param {Function} props.addSkill - Function to add a skill to the skills array
 * @param {Function} props.removeSkill - Function to remove a skill from the skills array
 * @param {Function} props.handleSubmit - Form submission handler from form library
 * @param {boolean} props.isCurrent - Whether this is a current position
 * @param {boolean} props.isValid - Whether the form is currently valid
 * @param {string[]} props.months - Array of month names for dropdowns
 * @param {string[]} props.years - Array of years for dropdowns
 * @param {Object} props.errors - Object containing validation error messages
 * @param {Function} props.setValue - Function to set form field values
 * @param {string} props.skillInput - Current value of the skill input field
 * @param {Function} props.setSkillInput - Function to update skill input value
 * @param {Function} props.handleIsCurrent - Handler for toggling current position status
 * @param {string[]} props.skills - Array of skills associated with this experience
 * @param {Function} props.watch - Function to observe form field values
 * @param {number} props.currentStage - Current form stage (1-4)
 * @param {Function} props.validateStageAndProceed - Function to validate current stage and navigate
 * @param {Object} props.stageValidation - Object tracking validation status of each stage
 * @param {boolean} props.isLoading - Whether submission is in progress
 * @param {string|null} props.submitError - Error message from submission attempt
 * @param {boolean} props.showSuccess - Whether to display success message
 * @param {Function} props.setSubmitError - Function to update submission error state
 * @param {boolean} [props.adding=false] - Whether adding new (true) or editing existing (false)
 * @param {Function} props.handleDeleteExperience - Function to delete the experience entry
 * @param {Array} props.employmentTypes - Array of available employment type options
 * @param {string[]} props.stageTitles - Array of titles for each stage
 * @returns {JSX.Element} Multi-stage experience form with progress tracking
 */
export default function ModExperiencePresentation({
  form,
  handleFormSubmit,
  addSkill,
  removeSkill,
  handleSubmit,
  isCurrent,
  isValid,
  months,
  years,
  errors,
  setValue,
  skillInput,
  setSkillInput,
  handleIsCurrent,
  skills,
  watch,
  currentStage,
  validateStageAndProceed,
  stageValidation,
  isLoading,
  submitError,
  showSuccess,
  setSubmitError,
  adding = false,
  handleDeleteExperience,
  employmentTypes,
  stageTitles,
}) {
  return (
    <div
      className="p-4 text-primary overflow-y-auto"
      data-testid="mod-experience-presentation"
    >
      <div
        className="text-xl font-bold text-center mb-4"
        data-testid="mod-experience-title"
      >
        Experience Information
      </div>

      {/* Progress indicator */}
      <div
        className="flex justify-between mb-6 px-2"
        data-testid="mod-experience-progress"
      >
        {stageTitles.map((title, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            data-testid={`mod-experience-stage-${index + 1}`}
          >
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center mb-1
                ${
                  index + 1 === currentStage
                    ? "bg-secondary text-background font-bold"
                    : stageValidation[index + 1]
                    ? "bg-emerald-500 text-background"
                    : "bg-muted text-foreground"
                }`}
              data-testid={`mod-experience-stage-indicator-${index + 1}`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs ${
                index + 1 === currentStage ? "font-semibold" : ""
              }`}
              data-testid={`mod-experience-stage-title-${index + 1}`}
            >
              {title}
            </span>
          </div>
        ))}
      </div>

      {/* Enhanced Loading Indicator - Global overlay when submitting */}
      {isLoading && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 rounded-lg"
          data-testid="mod-experience-loading-overlay"
        >
          <div className="bg-background p-4 rounded-md shadow-lg flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="font-medium">Saving your experience information...</p>
          </div>
        </div>
      )}

      {/* Enhanced Error Message */}
      {submitError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm"
          data-testid="mod-experience-submit-error"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{submitError}</p>
              <button
                onClick={() => setSubmitError(null)}
                className="text-xs text-red-600 font-medium underline mt-1"
                data-testid="mod-experience-dismiss-error-button"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        data-testid="mod-experience-form"
      >
        {/* Stage 1: Basic Job Information */}
        {currentStage === 1 && (
          <div
            className="space-y-4"
            data-testid="mod-experience-stage1-content"
          >
            <div className="flex gap-2">
              <div className="flex-[2_1_0]">
                <Label className="font-semibold mb-2 flex gap-1" htmlFor="title">
                  Job Title
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="title"
                  value={watch("title")}
                  onChange={(e) => setValue("title", e.target.value)}
                  placeholder="Job Title"
                  data-testid="mod-experience-title-input"
                />
                {errors.title && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-experience-title-error"
                  >
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <Label className="font-semibold mb-2 flex gap-1" htmlFor="employmentType">
                  Type
                  <span className="text-muted">*</span>
                </Label>
                <Select
                  value={watch("employmentType")}
                  onValueChange={(value) => setValue("employmentType", value)}
                >
                  <SelectTrigger
                    id="employmentType"
                    data-testid="mod-experience-employment-type-trigger"
                  >
                    <SelectValue placeholder="Type">
                      {watch("employmentType")
                        ? employmentTypes.find(
                            (type) => type.value === watch("employmentType")
                          )?.label || watch("employmentType")
                        : "Type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent data-testid="mod-experience-employment-type-content">
                    {employmentTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        data-testid={`mod-experience-employment-type-${type.value}`}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employmentType && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-experience-employment-type-error"
                  >
                    {errors.employmentType}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-[2_1_0]">
                <Label className="font-semibold mb-2 flex gap-1" htmlFor="company">
                  Company
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="company"
                  value={watch("company")}
                  onChange={(e) => setValue("company", e.target.value)}
                  placeholder="Company Name"
                  data-testid="mod-experience-company-input"
                />
                {errors.company && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-experience-company-error"
                  >
                    {errors.company}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Label className="font-semibold mb-2 flex gap-1" htmlFor="location">
                  Location
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="location"
                  value={watch("location")}
                  onChange={(e) => setValue("location", e.target.value)}
                  placeholder="Location"
                  data-testid="mod-experience-location-input"
                />
                {errors.location && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-experience-location-error"
                  >
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Time Period */}
        {currentStage === 2 && (
          <div
            className="space-y-4"
            data-testid="mod-experience-stage2-content"
          >
            <div className="flex items-start gap-2">
              <Checkbox
                id="isCurrent"
                onCheckedChange={(value) => handleIsCurrent(value)}
                checked={isCurrent}
                data-testid="mod-experience-is-current-checkbox"
              />
              <Label className="font-semibold" htmlFor="isCurrent">
                I currently work here
              </Label>
            </div>

            <div className="flex gap-8 justify-between">
              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold mb-2 flex gap-1" htmlFor="startMonth">
                    Start Month
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("startDate.month")}
                    onValueChange={(value) =>
                      setValue("startDate.month", value)
                    }
                  >
                    <SelectTrigger
                      id="startMonth"
                      data-testid="mod-experience-start-month-trigger"
                    >
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-experience-start-month-content">
                      {months.map((month) => (
                        <SelectItem
                          key={month}
                          value={month}
                          data-testid={`mod-experience-start-month-${month}`}
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.startDate?.month && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-experience-start-month-error"
                    >
                      {errors.startDate.month}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="font-semibold mb-2 flex gap-1" htmlFor="startYear">
                    Start Year
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("startDate.year")}
                    onValueChange={(value) => setValue("startDate.year", value)}
                  >
                    <SelectTrigger
                      id="startYear"
                      data-testid="mod-experience-start-year-trigger"
                    >
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-experience-start-year-content">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          data-testid={`mod-experience-start-year-${year}`}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.startDate?.year && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-experience-start-year-error"
                    >
                      {errors.startDate.year}
                    </p>
                  )}
                </div>
              </div>

              {!isCurrent && (
                <div className="flex gap-4">
                  <div>
                    <Label className="font-semibold mb-2 flex gap-1" htmlFor="endMonth">
                      End Month
                      <span className="text-muted">*</span>
                    </Label>
                    <Select
                      value={watch("endDate.month")}
                      onValueChange={(value) =>
                        setValue("endDate.month", value)
                      }
                      disabled={isCurrent}
                    >
                      <SelectTrigger
                        id="endMonth"
                        data-testid="mod-experience-end-month-trigger"
                      >
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent data-testid="mod-experience-end-month-content">
                        {months.map((month) => (
                          <SelectItem
                            key={month}
                            value={month}
                            data-testid={`mod-experience-end-month-${month}`}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.endDate?.month && (
                      <p
                        className="text-red-500 text-xs mt-2"
                        data-testid="mod-experience-end-month-error"
                      >
                        {errors.endDate.month}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="font-semibold mb-2 flex gap-1" htmlFor="endYear">
                      End Year
                      <span className="text-muted">*</span>
                    </Label>
                    <Select
                      value={watch("endDate.year")}
                      onValueChange={(value) => setValue("endDate.year", value)}
                      disabled={isCurrent}
                    >
                      <SelectTrigger
                        id="endYear"
                        data-testid="mod-experience-end-year-trigger"
                      >
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent data-testid="mod-experience-end-year-content">
                        {years.map((year) => (
                          <SelectItem
                            key={year}
                            value={year}
                            data-testid={`mod-experience-end-year-${year}`}
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.endDate?.year && (
                      <p
                        className="text-red-500 text-xs mt-2"
                        data-testid="mod-experience-end-year-error"
                      >
                        {errors.endDate.year}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stage 3: Additional Details */}
        {currentStage === 3 && (
          <div
            className="space-y-4"
            data-testid="mod-experience-stage3-content"
          >
            <div className="space-y-2">
              <Label className="font-semibold mb-2" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={watch("description") || ""}
                onChange={(e) => setValue("description", e.target.value)}
                placeholder="Describe your role and responsibilities"
                rows={4}
                className={errors.description ? "border-red-500" : ""}
                style={{ resize: "none" }}
                data-testid="mod-experience-description-textarea"
              />
              <div className="flex justify-between">
                {errors.description && (
                  <p
                    className="text-red-500 text-xs"
                    data-testid="mod-experience-description-error"
                  >
                    {errors.description}
                  </p>
                )}
                <span
                  className="text-xs text-muted"
                  data-testid="mod-experience-description-char-count"
                >
                  {watch("description")?.length || 0}/1000
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold mb-2">Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSkill(e);
                    }
                  }}
                  data-testid="mod-experience-skill-input"
                />
                <AddButton
                  onClick={addSkill}
                  data-testid="mod-experience-add-skill-button"
                />
              </div>
              <div
                className="flex flex-wrap gap-2 mt-2"
                data-testid="mod-experience-skills-list"
              >
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-full flex justify-between font-semibold items-center gap-1 bg-secondary text-background text-xs px-2 py-1"
                    data-testid={`mod-experience-skill-item-${index}`}
                  >
                    {skill}
                    <X
                      className="size-3 hover:cursor-pointer"
                      onClick={() => removeSkill(skill)}
                      data-testid={`mod-experience-remove-skill-${index}-button`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Review */}
        {currentStage === 4 && (
          <div
            className="space-y-6"
            data-testid="mod-experience-stage4-content"
          >
            <h3 className="text-lg font-semibold">
              Review Your Experience Information
            </h3>

            <div
              className="border rounded-md p-4 bg-muted/20 space-y-4"
              data-testid="mod-experience-review-details"
            >
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Job Title</p>
                    <p
                      className="font-medium"
                      data-testid="mod-experience-review-title"
                    >
                      {watch("title")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Employment Type
                    </p>
                    <p
                      className="font-medium"
                      data-testid="mod-experience-review-employment-type"
                    >
                      {employmentTypes.find(
                        (type) => type.value === watch("employmentType")
                      )?.label || watch("employmentType")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p
                      className="font-medium"
                      data-testid="mod-experience-review-company"
                    >
                      {watch("company")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p
                      className="font-medium"
                      data-testid="mod-experience-review-location"
                    >
                      {watch("location")}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Time Period
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p
                      className="font-medium"
                      data-testid="mod-experience-review-start-date"
                    >{`${watch("startDate.month")} ${watch(
                      "startDate.year"
                    )}`}</p>
                  </div>
                  {!isCurrent && (
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p
                        className="font-medium"
                        data-testid="mod-experience-review-end-date"
                      >{`${watch("endDate.month")} ${watch(
                        "endDate.year"
                      )}`}</p>
                    </div>
                  )}
                  {isCurrent && (
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p
                        className="font-medium"
                        data-testid="mod-experience-review-end-date-present"
                      >
                        Present
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Additional Details
                </h4>
                <div className="space-y-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p
                      className="font-medium"
                      data-testid="mod-experience-review-description"
                    >
                      {watch("description") || "No description provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Skills</p>
                    <div
                      className="flex flex-wrap gap-2"
                      data-testid="mod-experience-review-skills-list"
                    >
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-secondary text-background text-xs px-2 py-1"
                            data-testid={`mod-experience-review-skill-${index}`}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span
                          className="text-sm text-muted-foreground italic"
                          data-testid="mod-experience-review-no-skills"
                        >
                          No skills added
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between gap-2 mt-6">
          <div className="flex items-center gap-2">
            {currentStage > 1 && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => validateStageAndProceed("prev")}
                className="hover:cursor-pointer p-2 text-sm font-semibold bg-secondary/50 hover:bg-secondary/70 duration-200 text-foreground rounded-md px-4 disabled:opacity-50"
                data-testid="mod-experience-previous-button"
              >
                Previous
              </button>
            )}
            {!adding && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDeleteExperience()}
                className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md disabled:opacity-50"
                data-testid="mod-experience-delete-button"
              >
                Delete
              </button>
            )}
          </div>

          {currentStage < 4 && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => validateStageAndProceed("next")}
              className="hover:cursor-pointer p-2 text-sm font-semibold bg-secondary text-background rounded-md px-4 ml-auto disabled:opacity-50"
              data-testid="mod-experience-next-button"
            >
              Next
            </button>
          )}

          {currentStage === 4 && (
            <button
              className="hover:cursor-pointer disabled:bg-foreground/30 disabled:cursor-default p-2 text-sm font-semibold bg-secondary text-background rounded-md ml-auto flex items-center gap-2"
              type="submit"
              disabled={!isValid || isLoading || showSuccess}
              data-testid="mod-experience-save-button"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {/* Status banner for successful saves */}
        {showSuccess && (
          <div
            className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            data-testid="mod-experience-success-banner"
          >
            <span className="block sm:inline">
              Experience information saved successfully!
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
