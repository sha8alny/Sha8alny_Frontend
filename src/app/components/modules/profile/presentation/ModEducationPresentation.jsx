import { Input } from "@/app/components/ui/Input";
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
 * ModEducationPresentation - Multi-stage form for managing education entries in a user's profile
 * 
 * This component renders a comprehensive four-stage form interface for adding or editing
 * education information. It includes validation, form navigation, and status indicators.
 * 
 * The form progresses through these stages:
 * 1. Basic Information - School, degree, field of study, grade
 * 2. Time Period - Start and end dates
 * 3. Additional Details - Activities, description, and skills
 * 4. Review - Final review of all information before submission
 * 
 * @param {Object} props - Component props
 * @param {Object} props.form - Form object from form library
 * @param {string} props.educationId - ID of the education entry being edited
 * @param {Function} props.deleteEducation - Function to delete the education entry
 * @param {Function} props.handleFormSubmit - Function to handle form submission
 * @param {Function} props.addSkill - Function to add a skill to the skills array
 * @param {Function} props.removeSkill - Function to remove a skill from the skills array
 * @param {Function} props.handleSubmit - Form submission handler from form library
 * @param {boolean} props.isValid - Whether the form is currently valid
 * @param {string[]} props.months - Array of month names for dropdowns
 * @param {string[]} props.years - Array of years for dropdowns
 * @param {Object} props.errors - Object containing validation error messages
 * @param {Function} props.setValue - Function to set form field values
 * @param {string} props.skillInput - Current value of the skill input field
 * @param {Function} props.setSkillInput - Function to update skill input value
 * @param {string[]} props.skills - Array of skills associated with this education entry
 * @param {Function} props.watch - Function to observe form field values
 * @param {number} props.currentStage - Current form stage (1-4)
 * @param {Function} props.validateStageAndProceed - Function to validate current stage and navigate
 * @param {Object} props.stageValidation - Object tracking validation status of each stage
 * @param {boolean} props.isLoading - Whether submission is in progress
 * @param {string|null} props.submitError - Error message from submission attempt
 * @param {boolean} props.showSuccess - Whether to display success message
 * @param {Function} props.setSubmitError - Function to update submission error state
 * @param {boolean} [props.adding=false] - Whether adding new (true) or editing existing (false)
 * @returns {JSX.Element} Multi-stage education form with progress tracking
 */
export default function ModEducationPresentation({
  form,
  educationId,
  deleteEducation,
  handleFormSubmit,
  addSkill,
  removeSkill,
  handleSubmit,
  isValid,
  months,
  years,
  errors,
  setValue,
  skillInput,
  setSkillInput,
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
}) {
  // Stage titles for the progress indicator
  const stageTitles = [
    "Basic Information",
    "Time Period",
    "Additional Details",
    "Review",
  ];

  return (
    <div
      className="p-4 text-primary overflow-y-auto"
      data-testid="mod-education-presentation"
    >
      <div
        className="text-xl font-bold text-center mb-4"
        data-testid="mod-education-title"
      >
        Education Information
      </div>

      {/* Progress indicator */}
      <div
        className="flex justify-between mb-6 px-2"
        data-testid="mod-education-progress"
      >
        {stageTitles.map((title, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            data-testid={`mod-education-stage-${index + 1}`}
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
              data-testid={`mod-education-stage-indicator-${index + 1}`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs ${
                index + 1 === currentStage ? "font-semibold" : ""
              }`}
              data-testid={`mod-education-stage-title-${index + 1}`}
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
          data-testid="mod-education-loading-overlay"
        >
          <div className="bg-background p-4 rounded-md shadow-lg flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="font-medium">Saving your education information...</p>
          </div>
        </div>
      )}

      {/* Enhanced Error Message */}
      {submitError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm"
          data-testid="mod-education-submit-error"
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
                data-testid="mod-education-dismiss-error-button"
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
        data-testid="mod-education-form"
      >
        {/* Stage 1: Basic Education Information */}
        {currentStage === 1 && (
          <div className="space-y-4" data-testid="mod-education-stage1-content">
            <div className="flex gap-2">
              <div className="flex-[2_1_0]">
                <Label
                  className="font-semibold mb-2 flex gap-1"
                  htmlFor="school"
                >
                  School
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="school"
                  value={watch("school")}
                  onChange={(e) => setValue("school", e.target.value)}
                  placeholder="School"
                  data-testid="mod-education-school-input"
                />
                {errors.school && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-education-school-error"
                  >
                    {errors.school}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Label
                  className="font-semibold mb-2 flex gap-1"
                  htmlFor="degree"
                >
                  Degree
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="degree"
                  value={watch("degree")}
                  onChange={(e) => setValue("degree", e.target.value)}
                  placeholder="Degree"
                  data-testid="mod-education-degree-input"
                />
                {errors.degree && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-education-degree-error"
                  >
                    {errors.degree}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-[3_1_0]">
                <Label
                  className="font-semibold mb-2 flex gap-1"
                  htmlFor="fieldOfStudy"
                >
                  Field of Study
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="fieldOfStudy"
                  value={watch("fieldOfStudy")}
                  onChange={(e) => setValue("fieldOfStudy", e.target.value)}
                  placeholder="Field of Study"
                  data-testid="mod-education-field-input"
                />
                {errors.fieldOfStudy && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-education-field-error"
                  >
                    {errors.fieldOfStudy}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Label
                  className="font-semibold mb-2 flex gap-1"
                  htmlFor="grade"
                >
                  Grade
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="grade"
                  value={watch("grade")}
                  onChange={(e) => setValue("grade", e.target.value)}
                  placeholder="Grade"
                  data-testid="mod-education-grade-input"
                />
                {errors.grade && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-education-grade-error"
                  >
                    {errors.grade}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Time Period */}
        {currentStage === 2 && (
          <div className="space-y-4" data-testid="mod-education-stage2-content">
            <div className="flex gap-8 justify-between">
              <div className="flex gap-4">
                <div>
                  <Label
                    className="font-semibold mb-2 flex gap-1"
                    htmlFor="startMonth"
                  >
                    Start Month
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("startMonth")}
                    onValueChange={(value) => setValue("startMonth", value)}
                  >
                    <SelectTrigger
                      id="startMonth"
                      data-testid="mod-education-start-month-trigger"
                    >
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-education-start-month-content">
                      {months.map((month) => (
                        <SelectItem
                          key={month}
                          value={month}
                          data-testid={`mod-education-start-month-${month}`}
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.startMonth && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-education-start-month-error"
                    >
                      {errors.startMonth}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    className="font-semibold mb-2 flex gap-1"
                    htmlFor="startYear"
                  >
                    Start Year
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("startYear")}
                    onValueChange={(value) => setValue("startYear", value)}
                  >
                    <SelectTrigger
                      id="startYear"
                      data-testid="mod-education-start-year-trigger"
                    >
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-education-start-year-content">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          data-testid={`mod-education-start-year-${year}`}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.startYear && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-education-start-year-error"
                    >
                      {errors.startYear}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label
                    className="font-semibold mb-2 flex gap-1"
                    htmlFor="endMonth"
                  >
                    End Month
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("endMonth")}
                    onValueChange={(value) => setValue("endMonth", value)}
                  >
                    <SelectTrigger
                      id="endMonth"
                      data-testid="mod-education-end-month-trigger"
                    >
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-education-end-month-content">
                      {months.map((month) => (
                        <SelectItem
                          key={month}
                          value={month}
                          data-testid={`mod-education-end-month-${month}`}
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.endMonth && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-education-end-month-error"
                    >
                      {errors.endMonth}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    className="font-semibold mb-2 flex gap-1"
                    htmlFor="endYear"
                  >
                    End Year
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("endYear")}
                    onValueChange={(value) => setValue("endYear", value)}
                  >
                    <SelectTrigger
                      id="endYear"
                      data-testid="mod-education-end-year-trigger"
                    >
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-education-end-year-content">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          data-testid={`mod-education-end-year-${year}`}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.endYear && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-education-end-year-error"
                    >
                      {errors.endYear}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Additional Details */}
        {currentStage === 3 && (
          <div className="space-y-4" data-testid="mod-education-stage3-content">
            <div className="space-y-2">
              <Label className="font-semibold mb-2" htmlFor="activities">
                Activities
              </Label>
              <Textarea
                id="activities"
                value={watch("activities") || ""}
                onChange={(e) => setValue("activities", e.target.value)}
                placeholder="List your activities"
                rows={3}
                style={{ resize: "none" }}
                className={errors.activities ? "border-red-500" : ""}
                data-testid="mod-education-activities-textarea"
              />
              <div className="flex justify-between">
                {errors.activities && (
                  <p
                    className="text-red-500 text-xs"
                    data-testid="mod-education-activities-error"
                  >
                    {errors.activities}
                  </p>
                )}
                <span
                  className="text-xs text-muted"
                  data-testid="mod-education-activities-char-count"
                >
                  {watch("activities")?.length || 0}/500
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold mb-2" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={watch("description") || ""}
                onChange={(e) => setValue("description", e.target.value)}
                placeholder="Add a description"
                rows={4}
                className={errors.description ? "border-red-500" : ""}
                style={{ resize: "none" }}
                data-testid="mod-education-description-textarea"
              />
              <div className="flex justify-between">
                {errors.description && (
                  <p
                    className="text-red-500 text-xs"
                    data-testid="mod-education-description-error"
                  >
                    {errors.description}
                  </p>
                )}
                <span
                  className="text-xs text-muted"
                  data-testid="mod-education-description-char-count"
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
                  data-testid="mod-education-skill-input"
                />
                <AddButton
                  onClick={addSkill}
                  data-testid="mod-education-add-skill-button"
                />
              </div>
              <div
                className="flex flex-wrap gap-2 mt-2"
                data-testid="mod-education-skills-list"
              >
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-full flex justify-between font-semibold items-center gap-1 bg-secondary text-background text-xs px-2 py-1"
                    data-testid={`mod-education-skill-item-${index}`}
                  >
                    {skill}
                    <X
                      className="size-3 hover:cursor-pointer"
                      onClick={() => removeSkill(skill)}
                      data-testid={`mod-education-remove-skill-${index}-button`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Review */}
        {currentStage === 4 && (
          <div className="space-y-6" data-testid="mod-education-stage4-content">
            <h3 className="text-lg font-semibold">
              Review Your Education Information
            </h3>

            <div
              className="border rounded-md p-4 bg-muted/20 space-y-4"
              data-testid="mod-education-review-details"
            >
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">School</p>
                    <p
                      className="font-medium"
                      data-testid="mod-education-review-school"
                    >
                      {watch("school")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Degree</p>
                    <p
                      className="font-medium"
                      data-testid="mod-education-review-degree"
                    >
                      {watch("degree")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Field of Study
                    </p>
                    <p
                      className="font-medium"
                      data-testid="mod-education-review-field"
                    >
                      {watch("fieldOfStudy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p
                      className="font-medium"
                      data-testid="mod-education-review-grade"
                    >
                      {watch("grade")}
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
                      data-testid="mod-education-review-start-date"
                    >{`${watch("startMonth")} ${watch("startYear")}`}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p
                      className="font-medium"
                      data-testid="mod-education-review-end-date"
                    >
                      {`${watch("endMonth")} ${watch("endYear")}`}
                    </p>
                  </div>
                </div>
              </div>

              {(watch("activities") ||
                watch("description") ||
                skills.length > 0) && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Additional Details
                  </h4>

                  {watch("activities") && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        Activities
                      </p>
                      <p
                        className="text-sm"
                        data-testid="mod-education-review-activities"
                      >
                        {watch("activities")}
                      </p>
                    </div>
                  )}

                  {watch("description") && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        Description
                      </p>
                      <p
                        className="text-sm"
                        data-testid="mod-education-review-description"
                      >
                        {watch("description")}
                      </p>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Skills</p>
                      <div
                        className="flex flex-wrap gap-1 mt-1"
                        data-testid="mod-education-review-skills-list"
                      >
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-secondary text-background text-xs rounded-full px-2 py-0.5"
                            data-testid={`mod-education-review-skill-${index}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                data-testid="mod-education-previous-button"
              >
                Previous
              </button>
            )}

            {!adding && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => deleteEducation(educationId)}
                className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md disabled:opacity-50"
                data-testid="mod-education-delete-button"
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
              data-testid="mod-education-next-button"
            >
              Next
            </button>
          )}

          {currentStage === 4 && (
            <button
              className="hover:cursor-pointer disabled:bg-foreground/30 disabled:cursor-default p-2 text-sm font-semibold bg-secondary text-background rounded-md ml-auto flex items-center gap-2"
              type="submit"
              disabled={!isValid || isLoading}
              data-testid="mod-education-save-button"
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
            data-testid="mod-education-success-banner"
          >
            <span className="block sm:inline">
              Education information saved successfully!
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
