import { Input } from "@/app/components/ui/Input";
import { Checkbox } from "@/app/components/ui/CheckBox";
import { Textarea } from "@/app/components/ui/Textarea";
import { Label } from "@/app/components/ui/Label";
import { X } from "lucide-react";
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
 * Displays a form for users to add or edit education information in their profile.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.form - Form object containing control methods and state
 * @param {Function} props.handleFormSubmit - Handler function for form submission
 * @param {Function} props.addSkill - Function to add a skill to the skills list
 * @param {Function} props.removeSkill - Function to remove a skill from the skills list
 * @param {Function} props.handleSubmit - Form submission handler from react-hook-form
 * @param {boolean} props.isCurrent - Flag indicating if the education is current/ongoing
 * @param {boolean} props.isValid - Flag indicating if the form is valid
 * @param {Array<string>} props.months - List of months for dropdown selection
 * @param {Array<string>} props.years - List of years for dropdown selection
 * @param {Object} props.errors - Form validation errors
 * @param {Function} props.setValue - Function to set form field values
 * @param {string} props.skillInput - Current value of the skill input field
 * @param {Function} props.setSkillInput - Function to update the skill input value
 * @param {Array<string>} props.skills - List of skills associated with this education
 * @param {Function} props.watch - Function to observe form field values
 * @param {Function} props.handleIsCurrent - Handler for the "Currently Studying" checkbox
 * @param {boolean} [props.adding=false] - Flag indicating if this is a new education entry
 * @returns {JSX.Element} The education form component
 */
export default function ModEducationPresentation({
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
  skills,
  watch,
  handleIsCurrent,
  adding = false,
}) {
  return (
    <div className="p-4 text-primary overflow-y-auto">
      <div className="text-xl font-bold text-center mb-4">
        Education Information
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <Checkbox
                  {...field}
                  id="isCurrent"
                  onCheckedChange={(value) => handleIsCurrent(value)}
                />
                <Label className="font-semibold mb-2" htmlFor="isCurrent">
                  Currently Studying
                </Label>
              </div>
            )}
          />
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
            {!isCurrent && (
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
            )}
          </div>
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
          <div className="flex justify-between gap-2 mt-6">
            {!adding && (
              <button className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md w-full">
                Delete
              </button>
            )}
            <button 
              type="button" 
              onClick={() => {
                console.log("Form state:", form.getValues());
                console.log("Errors:", errors);
                console.log("Is valid (from prop):", isValid);
                console.log("Form is valid (from form):", form.formState.isValid);
              }}
              className="hover:cursor-pointer p-2 text-sm font-semibold bg-blue-500 dark:bg-blue-700 text-background rounded-md w-full"
            >
              Show Form State
            </button>
            <button
              className="hover:cursor-pointer disabled:bg-foreground disabled:cursor-default p-2 text-sm font-semibold bg-secondary text-background rounded-md w-full"
              type="submit"
              disabled={!isValid}
            >
              Save
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
