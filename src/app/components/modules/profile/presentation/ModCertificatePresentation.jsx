import { Input } from "@/app/components/ui/Input";
import { Checkbox } from "@/app/components/ui/CheckBox";
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

export default function ModCertificatePresentation({
  form,
  handleFormSubmit,
  addSkill,
  removeSkill,
  handleNeverExpires,
  handleSubmit,
  neverExpires,
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
        Certificate Information
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex-1">
                  <Label className="font-semibold mb-2" htmlFor="name">
                    Certificate Name
                  </Label>
                  <Input {...field} id="name" placeholder="Enter the certification name." />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="issuingOrganization"
              render={({ field }) => (
                <div className="flex-1 min-w-0">
                  <Label
                    className="font-semibold mb-2"
                    htmlFor="issuingOrganization"
                  >
                    Issuing Organization
                  </Label>
                  <Input {...field} id="issuingOrganization" placeholder="Enter the organization." />
                  {errors.issuingOrganization && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.issuingOrganization.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="neverExpires"
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <Checkbox
                  {...field}
                  id="neverExpires"
                  onCheckedChange={(value) => handleNeverExpires(value)}
                />
                <Label className="font-semibold mb-2" htmlFor="neverExpires">
                  This certificate does not expire
                </Label>
              </div>
            )}
          />
          <div className="flex justify-between gap-6">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="issueDate.month"
                render={({ field }) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="issueMonth">
                      Issue Month
                    </Label>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        setValue("issueDate.month", value)
                      }
                    >
                      <SelectTrigger id="issueMonth">
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
                    {errors.issueDate?.month && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.issueDate.month.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="issueDate.year"
                render={({ field }) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="issueYear">
                      Issue Year
                    </Label>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        setValue("issueDate.year", value)
                      }
                    >
                      <SelectTrigger id="issueYear">
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
                    {errors.issueDate?.year && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.issueDate.year.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            {!neverExpires && (
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="expirationDate.month"
                  render={({ field }) => (
                    <div>
                      <Label className="font-semibold mb-2" htmlFor="expirationMonth">
                        Exp. Month
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          setValue("expirationDate.month", value)
                        }
                      >
                        <SelectTrigger id="expirationMonth">
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
                      {errors.expirationDate?.month && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.expirationDate.month.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expirationDate.year"
                  render={({ field }) => (
                    <div>
                      <Label className="font-semibold mb-2" htmlFor="expirationYear">
                        Exp. Year
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          setValue("expirationDate.year", value)
                        }
                      >
                        <SelectTrigger id="expirationYear">
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
                      {errors.expirationDate?.year && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.expirationDate.year.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            )}
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