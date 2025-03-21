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
  skills,
  watch,
  adding = false,
}) {
  return (
    <div className="p-4 text-primary overflow-y-auto">
      <div className="text-xl font-bold text-center mb-4">
        Experience Information
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                      <SelectValue>
                        <span className={field.value ? "" : "text-muted"}>
                          {field.value || "Type"}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Full-time",
                        "Part-time",
                        "Contract",
                        "Freelance",
                        "Internship",
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <Checkbox
                  {...field}
                  id="isCurrent"
                  onCheckedChange={(value) => setValue("isCurrent", value)}
                />
                <Label className="font-semibold mb-2" htmlFor="isCurrent">
                  I currently work here
                </Label>
              </div>
            )}
          />
          <div className="flex justify-between">
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
                        <SelectValue>
                          <span className={field.value ? "" : "text-muted"}>
                            {field.value || "Month"}
                          </span>
                        </SelectValue>
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
                        <SelectValue>
                          <span className={field.value ? "" : "text-muted"}>
                            {field.value || "Year"}
                          </span>
                        </SelectValue>
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
                      >
                        <SelectTrigger id="endMonth">
                          <SelectValue>
                            <span className={field.value ? "" : "text-muted"}>
                              {field.value || "Month"}
                            </span>
                          </SelectValue>
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
                      >
                        <SelectTrigger id="endYear">
                          <SelectValue>
                            <span className={field.value ? "" : "text-muted"}>
                              {field.value || "Year"}
                            </span>
                          </SelectValue>
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
          <div className="flex justify-between gap-2 mt-6">
            {!adding && (
              <button className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md w-full">
                Delete
              </button>
            )}
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
