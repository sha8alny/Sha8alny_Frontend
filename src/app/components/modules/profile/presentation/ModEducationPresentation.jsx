import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Label } from "@/app/components/ui/Label";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { Form, FormField } from "@/app/components/ui/Form";
import AddButton from "@/app/components/ui/AddButton";
import { Controller } from "react-hook-form";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Education form presentation component.
 * Displays a multi-stage form for users to add or edit education information in their profile.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.form - Form object containing control methods and state
 * @param {Function} props.handleFormSubmit - Handler function for form submission
 * @param {Function} props.addSkill - Function to add a skill to the skills list
 * @param {Function} props.removeSkill - Function to remove a skill from the skills list
 * @param {Function} props.handleSubmit - Form submission handler from react-hook-form
 * @param {boolean} props.isValid - Flag indicating if the form is valid
 * @param {Array<string>} props.months - List of months for dropdown selection
 * @param {Array<string>} props.years - List of years for dropdown selection
 * @param {Object} props.errors - Form validation errors
 * @param {Function} props.setValue - Function to set form field values
 * @param {string} props.skillInput - Current value of the skill input field
 * @param {Function} props.setSkillInput - Function to update the skill input value
 * @param {Array<string>} props.skills - List of skills associated with this education
 * @param {Function} props.watch - Function to observe form field values
 * @param {number} props.currentStage - Current stage of the multi-stage form
 * @param {Function} props.validateStageAndProceed - Function to validate and navigate between stages
 * @param {Object} props.stageValidation - Object containing validation status of each stage
 * @param {boolean} [props.adding=false] - Flag indicating if this is a new education entry
 * @param {boolean} props.isLoading - Flag indicating if the form is currently submitting
 * @param {string} props.submitError - Error message for form submission
 * @param {boolean} props.showSuccess - Flag indicating if the form submission was successful
 * @param {Function} props.setSubmitError - Function to clear the submit error
 * @returns {JSX.Element} The education form component
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
    "Review"
  ];

  return (
    <div className="p-4 text-primary overflow-y-auto">
      <div className="text-xl font-bold text-center mb-4">
        Education Information
      </div>
      
      {/* Progress indicator */}
      <div className="flex justify-between mb-6 px-2">
        {stageTitles.map((title, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`rounded-full h-8 w-8 flex items-center justify-center mb-1
                ${index + 1 === currentStage ? 'bg-secondary text-background font-bold' : 
                  stageValidation[index + 1] ? 'bg-emerald-500 text-background' : 'bg-muted text-foreground'}`}
            >
              {index + 1}
            </div>
            <span className={`text-xs ${index + 1 === currentStage ? 'font-semibold' : ''}`}>
              {title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Enhanced Loading Indicator - Global overlay when submitting */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-background p-4 rounded-md shadow-lg flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="font-medium">Saving your education information...</p>
          </div>
        </div>
      )}
      
      {/* Enhanced Error Message */}
      {submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {submitError}
              </p>
              <button 
                onClick={() => setSubmitError(null)} 
                className="text-xs text-red-600 font-medium underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Stage 1: Basic Education Information */}
          {currentStage === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <div className="flex-[2_1_0]">
                      <Label className="font-semibold mb-2" htmlFor="school">
                        School
                      </Label>
                      <Input {...field} id="school" placeholder="School" />
                      {errors.school && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <div className="flex-1">
                      <Label className="font-semibold mb-2" htmlFor="degree">
                        Degree
                      </Label>
                      <Input {...field} id="degree" placeholder="Degree" />
                      {errors.degree && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.degree.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <div className="flex-[3_1_0]">
                      <Label className="font-semibold mb-2" htmlFor="fieldOfStudy">
                        Field of Study
                      </Label>
                      <Input
                        {...field}
                        id="fieldOfStudy"
                        placeholder="Field of Study"
                      />
                      {errors.fieldOfStudy && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.fieldOfStudy.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <div className="flex-1">
                      <Label className="font-semibold mb-2" htmlFor="grade">
                        Grade
                      </Label>
                      <Input {...field} id="grade" placeholder="Grade" />
                      {errors.grade && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.grade.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {/* Stage 2: Time Period */}
          {currentStage === 2 && (
            <div className="space-y-4">
              <div className="flex gap-8 justify-between">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="startMonth"
                    render={({ field }) => (
                      <div>
                        <Label className="font-semibold mb-2" htmlFor="startMonth">
                          Start Month
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) => setValue("startMonth", value)}
                        >
                          <SelectTrigger id="startMonth">
                            <SelectValue value={field.value} placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.startMonth && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.startMonth.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startYear"
                    render={({ field }) => (
                      <div>
                        <Label className="font-semibold mb-2" htmlFor="startYear">
                          Start Year
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) => setValue("startYear", value)}
                        >
                          <SelectTrigger id="startYear">
                            <SelectValue value={field.value} placeholder="Select Year"/>
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.startYear && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.startYear.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="endMonth"
                    render={({ field }) => (
                      <div>
                        <Label className="font-semibold mb-2" htmlFor="endMonth">
                          End Month
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) => setValue("endMonth", value)}
                        >
                          <SelectTrigger id="endMonth">
                            <SelectValue value={field.value} placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.endMonth && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.endMonth.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endYear"
                    render={({ field }) => (
                      <div>
                        <Label className="font-semibold mb-2" htmlFor="endYear">
                          End Year
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) => setValue("endYear", value)}
                        >
                          <SelectTrigger id="endYear">
                            <SelectValue value={field.value} placeholder="Select Year"/>
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.endYear && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.endYear.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: Additional Details */}
          {currentStage === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold mb-2" htmlFor="activities">
                  Activities
                </Label>
                <Controller
                  name="activities"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      id="activities"
                      {...field}
                      placeholder="List your activities"
                      rows={3}
                      style={{ resize: "none" }}
                      className={errors.activities ? "border-red-500" : ""}
                    />
                  )}
                />
                <div className="flex justify-between">
                  {errors.activities && (
                    <p className="text-red-500 text-xs">
                      {errors.activities.message}
                    </p>
                  )}
                  <span className="text-xs text-muted">
                    {watch("activities")?.length || 0}/500
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold mb-2" htmlFor="description">
                  Description
                </Label>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      {...field}
                      placeholder="Add a description"
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                      style={{ resize: "none" }}
                    />
                  )}
                />
                <div className="flex justify-between">
                  {errors.description && (
                    <p className="text-red-500 text-xs">
                      {errors.description.message}
                    </p>
                  )}
                  <span className="text-xs text-muted">
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
                  />
                  <AddButton onClick={addSkill} />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="rounded-full flex justify-between font-semibold items-center gap-1 bg-secondary text-background text-xs px-2 py-1"
                    >
                      {skill}
                      <X
                        className="size-3 hover:cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stage 4: Review */}
          {currentStage === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Education Information</h3>
              
              <div className="border rounded-md p-4 bg-muted/20 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">School</p>
                      <p className="font-medium">{watch("school")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Degree</p>
                      <p className="font-medium">{watch("degree")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Field of Study</p>
                      <p className="font-medium">{watch("fieldOfStudy")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Grade</p>
                      <p className="font-medium">{watch("grade")}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Time Period</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">{`${watch("startMonth")} ${watch("startYear")}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="font-medium">
                        {watch("isCurrent") ? "Current" : `${watch("endMonth")} ${watch("endYear")}`}
                      </p>
                    </div>
                  </div>
                </div>

                {(watch("activities") || watch("description") || skills.length > 0) && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Additional Details</h4>
                    
                    {watch("activities") && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Activities</p>
                        <p className="text-sm">{watch("activities")}</p>
                      </div>
                    )}
                    
                    {watch("description") && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Description</p>
                        <p className="text-sm">{watch("description")}</p>
                      </div>
                    )}
                    
                    {skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skills.map((skill, index) => (
                            <span key={index} className="bg-secondary text-background text-xs rounded-full px-2 py-0.5">
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
            {(currentStage > 1) && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => validateStageAndProceed('prev')}
                className="hover:cursor-pointer p-2 text-sm font-semibold bg-secondary/50 hover:bg-secondary/70 duration-200 text-foreground rounded-md px-4 disabled:opacity-50"
              >
                Previous
              </button>
            )}
            
            {(currentStage < 4) && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => validateStageAndProceed('next')}
                className="hover:cursor-pointer p-2 text-sm font-semibold bg-secondary text-background rounded-md px-4 ml-auto disabled:opacity-50"
              >
                Next
              </button>
            )}
            
            {currentStage === 4 && (
              <>
                {!adding && (
                  <button 
                    type="button"
                    disabled={isLoading}
                    onClick={() => deleteEducation(educationId)}
                    className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
                <button
                  className="hover:cursor-pointer disabled:bg-foreground/30 disabled:cursor-default p-2 text-sm font-semibold bg-secondary text-background rounded-md ml-auto flex items-center gap-2"
                  type="submit"
                  disabled={!isValid || isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
          
          {/* Status banner for successful saves - using showSuccess instead of handleUserUpdate.isSuccess */}
          {showSuccess && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Education information saved successfully!</span>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
