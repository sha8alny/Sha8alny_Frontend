import { Input } from "@/app/components/ui/Input";
import { Checkbox } from "@/app/components/ui/CheckBox";
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
 * A presentation component for displaying and managing certificate information in a form.
 * Uses a multi-stage approach similar to ModExperiencePresentation.
 */
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
  currentStage,
  validateStageAndProceed,
  stageValidation,
  isLoading,
  submitError,
  showSuccess,
  setSubmitError,
  adding = false,
  handleDeleteCertificate,
  stageTitles = ["Certificate Info", "Time Period", "Skills", "Review"],
}) {
  return (
    <div
      className="p-4 text-primary overflow-y-auto"
      data-testid="mod-certificate-presentation"
    >
      <div
        className="text-xl font-bold text-center mb-4"
        data-testid="mod-certificate-title"
      >
        Certificate Information
      </div>

      {/* Progress indicator */}
      <div
        className="flex justify-between mb-6 px-2"
        data-testid="mod-certificate-progress"
      >
        {stageTitles.map((title, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            data-testid={`mod-certificate-stage-${index + 1}`}
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
              data-testid={`mod-certificate-stage-indicator-${index + 1}`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs ${
                index + 1 === currentStage ? "font-semibold" : ""
              }`}
              data-testid={`mod-certificate-stage-title-${index + 1}`}
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
          data-testid="mod-certificate-loading-overlay"
        >
          <div className="bg-background p-4 rounded-md shadow-lg flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="font-medium">
              Saving your certificate information...
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Error Message */}
      {submitError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm"
          data-testid="mod-certificate-submit-error"
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
                data-testid="mod-certificate-dismiss-error-button"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Form with regular form element */}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        data-testid="mod-certificate-form"
      >
        {/* Stage 1: Certificate Info */}
        {currentStage === 1 && (
          <div
            className="space-y-4"
            data-testid="mod-certificate-stage1-content"
          >
            <div className="flex gap-2">
              {/* Replace FormField with direct input */}
              <div className="flex-1">
                <Label className="font-semibold flex gap-1 mb-2" htmlFor="name">
                  Certificate Name <span className="text-muted">*</span>
                </Label>
                <Input
                  id="name"
                  value={watch("name")}
                  onChange={(e) => setValue("name", e.target.value)}
                  placeholder="Enter the certification name."
                  data-testid="mod-certificate-name-input"
                />
                {errors.name && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-certificate-name-error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Label
                  className="font-semibold mb-2 flex gap-1"
                  htmlFor="issuingOrganization"
                >
                  Issuing Organization
                  <span className="text-muted">*</span>
                </Label>
                <Input
                  id="issuingOrganization"
                  value={watch("issuingOrganization")}
                  onChange={(e) =>
                    setValue("issuingOrganization", e.target.value)
                  }
                  placeholder="Enter the organization."
                  data-testid="mod-certificate-org-input"
                />
                {errors.issuingOrganization && (
                  <p
                    className="text-red-500 text-xs mt-2"
                    data-testid="mod-certificate-org-error"
                  >
                    {errors.issuingOrganization}
                  </p>
                )}
              </div>
            </div>

            {/* Certificate URL field */}
            <div>
              <Label className="font-semibold mb-2" htmlFor="certificateUrl">
                Certificate URL
              </Label>
              <Input
                id="certificateUrl"
                value={watch("certificateUrl")}
                onChange={(e) => setValue("certificateUrl", e.target.value)}
                placeholder="https://example.com/my-certificate"
                type="url"
                data-testid="mod-certificate-url-input"
              />
              {errors.certificateUrl && (
                <p
                  className="text-red-500 text-xs mt-2"
                  data-testid="mod-certificate-url-error"
                >
                  {errors.certificateUrl}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Add a link where others can verify this certificate (optional)
              </p>
            </div>
          </div>
        )}

        {/* Stage 2: Time Period */}
        {currentStage === 2 && (
          <div
            className="space-y-4"
            data-testid="mod-certificate-stage2-content"
          >
            <div className="flex items-start gap-2">
              <Checkbox
                id="neverExpires"
                checked={neverExpires}
                onCheckedChange={(value) => handleNeverExpires(value)}
                data-testid="mod-certificate-never-expires-checkbox"
              />
              <Label className="font-semibold" htmlFor="neverExpires">
                This certificate does not expire
              </Label>
            </div>

            <div className="flex justify-between gap-6">
              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold mb-2 flex gap-1" htmlFor="issueMonth">
                    Issue Month
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("issueDate.month")}
                    onValueChange={(value) =>
                      setValue("issueDate.month", value)
                    }
                  >
                    <SelectTrigger
                      id="issueMonth"
                      data-testid="mod-certificate-issue-month-trigger"
                    >
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-certificate-issue-month-content">
                      {months.map((month) => (
                        <SelectItem
                          key={month}
                          value={month}
                          data-testid={`mod-certificate-issue-month-${month}`}
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.issueDate?.month && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-certificate-issue-month-error"
                    >
                      {errors.issueDate.month}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="font-semibold mb-2 flex gap-1" htmlFor="issueYear">
                    Issue Year
                    <span className="text-muted">*</span>
                  </Label>
                  <Select
                    value={watch("issueDate.year")}
                    onValueChange={(value) => setValue("issueDate.year", value)}
                  >
                    <SelectTrigger
                      id="issueYear"
                      data-testid="mod-certificate-issue-year-trigger"
                    >
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent data-testid="mod-certificate-issue-year-content">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          data-testid={`mod-certificate-issue-year-${year}`}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.issueDate?.year && (
                    <p
                      className="text-red-500 text-xs mt-2"
                      data-testid="mod-certificate-issue-year-error"
                    >
                      {errors.issueDate.year}
                    </p>
                  )}
                </div>
              </div>

              {!neverExpires && (
                <div className="flex gap-4">
                  <div>
                    <Label
                      className="font-semibold mb-2"
                      htmlFor="expirationMonth"
                    >
                      Exp. Month
                    </Label>
                    <Select
                      value={watch("expirationDate.month")}
                      onValueChange={(value) =>
                        setValue("expirationDate.month", value)
                      }
                      disabled={neverExpires}
                    >
                      <SelectTrigger
                        id="expirationMonth"
                        data-testid="mod-certificate-exp-month-trigger"
                      >
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent data-testid="mod-certificate-exp-month-content">
                        {months.map((month) => (
                          <SelectItem
                            key={month}
                            value={month}
                            data-testid={`mod-certificate-exp-month-${month}`}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.expirationDate?.month && (
                      <p
                        className="text-red-500 text-xs mt-2"
                        data-testid="mod-certificate-exp-date-error"
                      >
                        {errors.expirationDate.month}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      className="font-semibold mb-2"
                      htmlFor="expirationYear"
                    >
                      Exp. Year
                    </Label>
                    <Select
                      value={watch("expirationDate.year")}
                      onValueChange={(value) =>
                        setValue("expirationDate.year", value)
                      }
                      disabled={neverExpires}
                    >
                      <SelectTrigger
                        id="expirationYear"
                        data-testid="mod-certificate-exp-year-trigger"
                      >
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent data-testid="mod-certificate-exp-year-content">
                        {years.map((year) => (
                          <SelectItem
                            key={year}
                            value={year}
                            data-testid={`mod-certificate-exp-year-${year}`}
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.expirationDate?.year && (
                      <p
                        className="text-red-500 text-xs mt-2"
                        data-testid="mod-certificate-exp-year-error"
                      >
                        {errors.expirationDate.year}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stage 3: Skills */}
        {currentStage === 3 && (
          <div
            className="space-y-4"
            data-testid="mod-certificate-stage3-content"
          >
            <div className="space-y-2">
              <Label className="font-semibold mb-2">Skills & Knowledge</Label>
              <p className="text-sm text-muted-foreground">
                Add skills or knowledge areas that this certification validates
                or covers.
              </p>
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
                  data-testid="mod-certificate-skill-input"
                />
                <AddButton
                  onClick={addSkill}
                  data-testid="mod-certificate-add-skill-button"
                />
              </div>
              <div
                className="flex flex-wrap gap-2 mt-2"
                data-testid="mod-certificate-skills-list"
              >
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-full flex justify-between font-semibold items-center gap-1 bg-secondary text-background text-xs px-2 py-1"
                    data-testid={`mod-certificate-skill-item-${index}`}
                  >
                    {skill}
                    <X
                      className="size-3 hover:cursor-pointer"
                      onClick={() => removeSkill(skill)}
                      data-testid={`mod-certificate-remove-skill-${index}-button`}
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
            data-testid="mod-certificate-stage4-content"
          >
            <h3 className="text-lg font-semibold">
              Review Your Certificate Information
            </h3>

            <div
              className="border rounded-md p-4 bg-muted/20 space-y-4"
              data-testid="mod-certificate-review-details"
            >
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Certificate Name
                    </p>
                    <p
                      className="font-medium"
                      data-testid="mod-certificate-review-name"
                    >
                      {watch("name")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Issuing Organization
                    </p>
                    <p
                      className="font-medium"
                      data-testid="mod-certificate-review-org"
                    >
                      {watch("issuingOrganization")}
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
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p
                      className="font-medium"
                      data-testid="mod-certificate-review-issue-date"
                    >{`${watch("issueDate.month")} ${watch(
                      "issueDate.year"
                    )}`}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expiration</p>
                    <p
                      className="font-medium"
                      data-testid="mod-certificate-review-exp-date"
                    >
                      {neverExpires
                        ? "This certificate does not expire"
                        : `${watch("expirationDate.month")} ${watch(
                            "expirationDate.year"
                          )}`}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Skills & Knowledge
                </h4>
                <div className="space-y-2 mt-2">
                  <div>
                    <div
                      className="flex flex-wrap gap-2"
                      data-testid="mod-certificate-review-skills-list"
                    >
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-secondary text-background text-xs px-2 py-1"
                            data-testid={`mod-certificate-review-skill-${index}`}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span
                          className="text-sm text-muted-foreground italic"
                          data-testid="mod-certificate-review-no-skills"
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
                data-testid="mod-certificate-previous-button"
              >
                Previous
              </button>
            )}
            {!adding && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDeleteCertificate()}
                className="hover:cursor-pointer p-2 text-sm font-semibold bg-red-500 dark:bg-red-800 text-background rounded-md disabled:opacity-50"
                data-testid="mod-certificate-delete-button"
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
              data-testid="mod-certificate-next-button"
            >
              Next
            </button>
          )}

          {currentStage === 4 && (
            <>
              <button
                className="hover:cursor-pointer disabled:bg-foreground/30 disabled:cursor-default p-2 text-sm font-semibold bg-secondary text-background rounded-md ml-auto flex items-center gap-2"
                type="submit"
                disabled={!isValid || isLoading || showSuccess}
                data-testid="mod-certificate-save-button"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>

        {/* Status banner for successful saves */}
        {showSuccess && (
          <div
            className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            data-testid="mod-certificate-success-banner"
          >
            <span className="block sm:inline">
              Certificate information saved successfully!
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
