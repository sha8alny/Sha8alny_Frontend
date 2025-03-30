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
import { Form, FormField } from "@/app/components/ui/Form";
import AddButton from "@/app/components/ui/AddButton";
import { Controller } from "react-hook-form";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A presentation component for displaying and managing experience information in a form.
 * Uses a multi-stage approach similar to ModEducationPresentation.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.form - The form object containing form controls and state
 * @param {Function} props.handleFormSubmit - Handler function for form submission
 * @param {Function} props.addSkill - Function to add a new skill
 * @param {Function} props.removeSkill - Function to remove a skill
 * @param {Function} props.handleSubmit - Form submission handler from react-hook-form
 * @param {boolean} props.isCurrent - Flag indicating if this is a current position
 * @param {boolean} props.isValid - Flag indicating if the form is valid
 * @param {string[]} props.months - Array of month options
 * @param {string[]} props.years - Array of year options
 * @param {Object} props.errors - Form validation errors object
 * @param {Function} props.setValue - Function to set form field values
 * @param {string} props.skillInput - Current value of the skill input field
 * @param {Function} props.setSkillInput - Function to update skill input value
 * @param {Function} props.handleIsCurrent - Handler for current position checkbox
 * @param {string[]} props.skills - Array of added skills
 * @param {Function} props.watch - Function to watch form field values
 * @param {number} props.currentStage - Current form stage
 * @param {Function} props.validateStageAndProceed - Function to validate and move between stages
 * @param {Object} props.stageValidation - Object tracking validation status of each stage
 * @param {boolean} props.isLoading - Flag indicating if data is being submitted
 * @param {string} props.submitError - Error message if submission failed
 * @param {boolean} props.showSuccess - Flag indicating if submission was successful
 * @param {Function} props.setSubmitError - Function to clear submission errors
 * @param {boolean} [props.adding=false] - Flag indicating if this is a new experience entry
 * @returns {JSX.Element} A multi-stage form for managing experience information
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
}) {
  // Stage titles for the progress indicator
  const stageTitles = [
    "Basic Information",
    "Time Period",
    "Additional Details",
    "Review"
  ];

  // Employment types constant
  const employmentTypes = [
    { value: "fullTime", label: "Full-time" },
    { value: "partTime", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "selfEmployed", label: "Self-employed" },
    { value: "internship", label: "Internship" },
    { value: "apprenticeship", label: "Apprenticeship" },
    { value: "seasonal", label: "Seasonal" },
  ];
  
  return (
    <div className="p-4 text-primary overflow-y-auto">
      <div className="text-xl font-bold text-center mb-4">
        Experience Information
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
            <p className="font-medium">Saving your experience information...</p>
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
          {/* Stage 1: Basic Job Information */}
          {currentStage === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <div className="flex-[2_1_0]">
                      <Label className="font-semibold mb-2" htmlFor="title">
                        Job Title
                      </Label>
                      <Input {...field} id="title" placeholder="Job Title" />
                      {errors.title && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <div>
                      <Label
                        className="font-semibold mb-2"
                        htmlFor="employmentType"
                      >
                        Type
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => setValue("employmentType", value)}
                      >
                        <SelectTrigger id="employmentType">
                          <SelectValue placeholder="Type">
                            {field.value 
                              ? employmentTypes.find(type => type.value === field.value)?.label || field.value 
                              : "Type"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.employmentType && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.employmentType.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <div className="flex-[2_1_0]">
                      <Label className="font-semibold mb-2" htmlFor="company">
                        Company
                      </Label>
                      <Input {...field} id="company" placeholder="Company Name" />
                      {errors.company && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.company.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <div className="flex-1">
                      <Label className="font-semibold mb-2" htmlFor="location">
                        Location
                      </Label>
                      <Input {...field} id="location" placeholder="Location" />
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.location.message}
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
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <div className="flex items-start gap-2">
                    <Checkbox
                      {...field}
                      id="isCurrent"
                      onCheckedChange={(value) => handleIsCurrent(value)}
                      checked={isCurrent}
                    />
                    <Label className="font-semibold" htmlFor="isCurrent">
                      I currently work here
                    </Label>
                  </div>
                )}
              />
              
              <div className="flex gap-8 justify-between">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="startDate.month"
                    render={({ field }) => (
                      <div>
                        <Label className="font-semibold mb-2" htmlFor="startMonth">
                          Start Month
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            setValue("startDate.month", value)
                          }
                        >
                          <SelectTrigger id="startMonth">
                            <SelectValue value={field.value} placeholder="Select Month"/>
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.startDate?.month && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.startDate.month.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate.year"
                    render={({ field }) => (
                      <div>
                        <Label className="font-semibold mb-2" htmlFor="startYear">
                          Start Year
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            setValue("startDate.year", value)
                          }
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
                        {errors.startDate?.year && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.startDate.year.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                
                {!isCurrent && (
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="endDate.month"
                      render={({ field }) => (
                        <div>
                          <Label className="font-semibold mb-2" htmlFor="endMonth">
                            End Month
                          </Label>
                          <Select
                            value={field.value}
                            onValueChange={(value) =>
                              setValue("endDate.month", value)
                            }
                            disabled={isCurrent}
                          >
                            <SelectTrigger id="endMonth">
                              <SelectValue value={field.value} placeholder="Select Month"/>
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.endDate?.month && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.endDate.month.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate.year"
                      render={({ field }) => (
                        <div>
                          <Label className="font-semibold mb-2" htmlFor="endYear">
                            End Year
                          </Label>
                          <Select
                            value={field.value}
                            onValueChange={(value) =>
                              setValue("endDate.year", value)
                            }
                            disabled={isCurrent}
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
                          {errors.endDate?.year && (
                            <p className="text-red-500 text-xs mt-2">
                              {errors.endDate.year.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage 3: Additional Details */}
          {currentStage === 3 && (
            <div className="space-y-4">
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
                      placeholder="Describe your role and responsibilities"
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
              <h3 className="text-lg font-semibold">Review Your Experience Information</h3>
              
              <div className="border rounded-md p-4 bg-muted/20 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Job Title</p>
                      <p className="font-medium">{watch("title")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Employment Type</p>
                      <p className="font-medium">
                        {employmentTypes.find(type => type.value === watch("employmentType"))?.label || watch("employmentType")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-medium">{watch("company")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{watch("location")}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Time Period</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">{`${watch("startDate.month")} ${watch("startDate.year")}`}</p>
                    </div>
                    {!isCurrent && (
                      <div>
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <p className="font-medium">{`${watch("endDate.month")} ${watch("endDate.year")}`}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Additional Details</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="font-medium">{watch("description")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-secondary text-background text-xs px-2 py-1"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
                    onClick={() => deleteEducation && deleteEducation(educationId)}
                    className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
                <button
                  className="hover:cursor-pointer disabled:bg-foreground/30 disabled:cursor-default p-2 text-sm font-semibold bg-secondary text-background rounded-md ml-auto flex items-center gap-2"
                  type="submit"
                  disabled={!isValid || isLoading || showSuccess}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
          
          {/* Status banner for successful saves */}
          {showSuccess && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Experience information saved successfully!</span>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
