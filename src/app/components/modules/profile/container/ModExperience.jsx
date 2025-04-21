"use client";
import Dialog from "@/app/components/ui/DialogMod";
import EditButton from "@/app/components/ui/EditButton";
import ModExperiencePresentation from "../presentation/ModExperiencePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useState } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
};

const stageTitles = [
  "Basic Information",
  "Time Period",
  "Additional Details",
  "Review",
];

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

/**
 * @namespace profile
 * @module profile
 */
/**
 * A component that renders a dialog for modifying or adding work experience
 * using a multi-stage form approach
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.experience] - Experience data object to edit
 * @param {string} [props.experience.title] - Job title
 * @param {string} [props.experience.employmentType] - Type of employment
 * @param {string} [props.experience.company] - Company name
 * @param {string} [props.experience.location] - Job location
 * @param {Object} [props.experience.startDate] - Start date object
 * @param {string} [props.experience.startDate.month] - Start month
 * @param {string} [props.experience.startDate.year] - Start year
 * @param {Object} [props.experience.endDate] - End date object
 * @param {string} [props.experience.endDate.month] - End month
 * @param {string} [props.experience.endDate.year] - End year
 * @param {boolean} [props.experience.isCurrent] - Whether this is current job
 * @param {string} [props.experience.description] - Job description
 * @param {string[]} [props.experience.skills] - Array of skills
 * @param {boolean} props.adding - Whether adding new experience or editing existing
 * @returns {JSX.Element} Dialog component for experience modification
 */
export default function ModExperience({ experience, adding }) {
  const [skillInput, setSkillInput] = useState("");
  const [currentStage, setCurrentStage] = useState(1);
  const [open, setOpen] = useState(false);
  const [stageValidation, setStageValidation] = useState({
    1: false,
    2: false,
    3: false,
  });

  // Form data state with improved employment type handling
  const [title, setTitle] = useState(experience?.title || "");
  const [employmentType, setEmploymentType] = useState(() => {
    if (experience?.employmentType) {
      // Check if it's already a value (e.g., "fullTime")
      if (
        employmentTypes.some((type) => type.value === experience.employmentType)
      ) {
        return experience.employmentType;
      }
      // Check if it's a label (e.g., "Full-time")
      const matchingType = employmentTypes.find(
        (type) => type.label === experience.employmentType
      );
      return matchingType ? matchingType.value : "";
    }
    return "";
  });
  const [company, setCompany] = useState(experience?.company || "");
  const [location, setLocation] = useState(experience?.location || "");
  const [startDate, setStartDate] = useState({
    month: experience?.startDate?.month || "",
    year: experience?.startDate?.year
      ? experience.startDate.year.toString()
      : "",
  });
  const [endDate, setEndDate] = useState(
    experience?.endDate
      ? {
          month: experience?.endDate?.month,
          year: experience?.endDate?.year.toString(),
        }
      : { month: "", year: "" }
  );
  const [isCurrent, setIsCurrent] = useState(experience?.isCurrent || false);
  const [description, setDescription] = useState(experience?.description || "");
  const [skills, setSkills] = useState(experience?.skills || []);

  // Error states
  const [titleError, setTitleError] = useState(null);
  const [employmentTypeError, setEmploymentTypeError] = useState(null);
  const [companyError, setCompanyError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);

  // UI states
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const years = generateYears();
  const handleUserUpdate = useUpdateProfile();
  const isLoading = handleUserUpdate.isPending;

  // Create errors object to mimic react-hook-form error structure
  const errors = {
    title: titleError,
    employmentType: employmentTypeError,
    company: companyError,
    location: locationError,
    startDate: startDateError,
    endDate: endDateError,
    description: descriptionError,
  };

  // Create form object to mimic react-hook-form
  const form = {
    handleSubmit: (callback) => (e) => {
      e?.preventDefault();
      const formData = {
        title,
        employmentType,
        company,
        location,
        startDate,
        endDate: isCurrent ? null : endDate,
        isCurrent,
        description,
        skills,
      };
      callback(formData);
    },
    setValue: (fieldName, value) => {
      if (fieldName === "title") setTitle(value);
      else if (fieldName === "employmentType") setEmploymentType(value);
      else if (fieldName === "company") setCompany(value);
      else if (fieldName === "location") setLocation(value);
      else if (fieldName.startsWith("startDate.")) {
        const field = fieldName.split(".")[1];
        setStartDate((prev) => ({ ...prev, [field]: value }));
      } else if (fieldName.startsWith("endDate.")) {
        const field = fieldName.split(".")[1];
        setEndDate((prev) => ({ ...prev, [field]: value }));
      } else if (fieldName === "isCurrent") setIsCurrent(value);
      else if (fieldName === "description") setDescription(value);
      else if (fieldName === "skills") setSkills(value);
    },
    watch: (fieldName) => {
      if (!fieldName) {
        return {
          title,
          employmentType,
          company,
          location,
          startDate,
          endDate: isCurrent ? null : endDate,
          isCurrent,
          description,
          skills,
        };
      }
      if (fieldName === "title") return title;
      if (fieldName === "employmentType") return employmentType;
      if (fieldName === "company") return company;
      if (fieldName === "location") return location;
      if (fieldName === "startDate") return startDate;
      if (fieldName === "endDate") return isCurrent ? null : endDate;
      if (fieldName === "isCurrent") return isCurrent;
      if (fieldName === "description") return description;
      if (fieldName === "skills") return skills;

      // Handle nested properties
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        if (parent === "startDate") return startDate[child];
        if (parent === "endDate") return isCurrent ? "" : endDate[child];
      }

      return undefined;
    },
    formState: { errors },
    trigger: async (fields) => {
      let isValid = true;

      // Reset errors for the fields we're validating
      if (Array.isArray(fields)) {
        if (fields.includes("title")) setTitleError(null);
        if (fields.includes("employmentType")) setEmploymentTypeError(null);
        if (fields.includes("company")) setCompanyError(null);
        if (fields.includes("location")) setLocationError(null);
        if (
          fields.includes("startDate.month") ||
          fields.includes("startDate.year")
        )
          setStartDateError(null);
        if (fields.includes("endDate.month") || fields.includes("endDate.year"))
          setEndDateError(null);
        if (fields.includes("description")) setDescriptionError(null);
      }

      // Validate each field
      for (const field of fields) {
        if (field === "title" && !title) {
          setTitleError("Job title is required.");
          isValid = false;
        }

        if (field === "employmentType" && !employmentType) {
          setEmploymentTypeError("Employment type is required.");
          isValid = false;
        }

        if (field === "company" && !company) {
          setCompanyError("Company is required.");
          isValid = false;
        }

        if (field === "location" && !location) {
          setLocationError("Location is required.");
          isValid = false;
        }

        if (field === "startDate.month" && !startDate.month) {
          setStartDateError((prev) => ({
            ...prev,
            month: "Start month is required.",
          }));
          isValid = false;
        }

        if (field === "startDate.year" && !startDate.year) {
          setStartDateError((prev) => ({
            ...prev,
            year: "Start year is required.",
          }));
          isValid = false;
        }

        if (!isCurrent) {
          if (field === "endDate.month" && !endDate?.month) {
            setEndDateError((prev) => ({
              ...prev,
              month: "End month is required.",
            }));
            isValid = false;
          }

          if (field === "endDate.year" && !endDate?.year) {
            setEndDateError((prev) => ({
              ...prev,
              year: "End year is required.",
            }));
            isValid = false;
          }
        }

        if (
          field === "description" &&
          description &&
          description.length > 1000
        ) {
          setDescriptionError("Description is too long.");
          isValid = false;
        }
      }

      // Check if end date is after start date when both dates are set
      if (
        !isCurrent &&
        startDate?.year &&
        startDate?.month &&
        endDate?.year &&
        endDate?.month &&
        fields.some(
          (field) => field.includes("startDate") || field.includes("endDate")
        )
      ) {
        const startYear = parseInt(startDate.year);
        const endYear = parseInt(endDate.year);

        if (startYear > endYear) {
          setEndDateError((prev) => ({
            ...prev,
            year: "End date cannot be before start date.",
          }));
          isValid = false;
        } else if (startYear === endYear) {
          const monthIndex = (month) => months.findIndex((m) => m === month);
          const startMonthIndex = monthIndex(startDate.month);
          const endMonthIndex = monthIndex(endDate.month);

          if (startMonthIndex > endMonthIndex) {
            setEndDateError((prev) => ({
              ...prev,
              month: "End date cannot be before start date.",
            }));
            isValid = false;
          }
        }
      }

      return isValid;
    },
    getValues: () => ({
      title,
      employmentType,
      company,
      location,
      startDate,
      endDate: isCurrent ? null : endDate,
      isCurrent,
      description,
      skills,
    }),
    setError: (field, error) => {
      if (field === "title") setTitleError(error.message);
      else if (field === "employmentType")
        setEmploymentTypeError(error.message);
      else if (field === "company") setCompanyError(error.message);
      else if (field === "location") setLocationError(error.message);
      else if (field === "startDate") setStartDateError(error.message);
      else if (field === "endDate") setEndDateError(error.message);
      else if (field === "description") setDescriptionError(error.message);
      else if (field.startsWith("startDate.")) {
        setStartDateError((prev) => ({
          ...prev,
          [field.split(".")[1]]: error.message,
        }));
      } else if (field.startsWith("endDate.")) {
        setEndDateError((prev) => ({
          ...prev,
          [field.split(".")[1]]: error.message,
        }));
      }
    },
    reset: (values) => {
      setTitle(values?.title || "");
      setEmploymentType(values?.employmentType || "");
      setCompany(values?.company || "");
      setLocation(values?.location || "");
      setStartDate({
        month: values?.startDate?.month || "",
        year: values?.startDate?.year || "",
      });
      setEndDate(values?.endDate || { month: "", year: "" });
      setIsCurrent(values?.isCurrent || false);
      setDescription(values?.description || "");
      setSkills(values?.skills || []);

      // Clear errors
      setTitleError(null);
      setEmploymentTypeError(null);
      setCompanyError(null);
      setLocationError(null);
      setStartDateError(null);
      setEndDateError(null);
      setDescriptionError(null);
    },
  };

  const handleIsCurrent = (value) => {
    setIsCurrent(value);
    if (value) {
      setEndDate({ month: "", year: "" });
      setEndDateError(null);
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput && !skills.includes(skillInput)) {
      setSkills((prev) => [...prev, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const validateStageAndProceed = async (direction) => {
    if (direction === "next") {
      let isValid = false;

      if (currentStage === 1) {
        isValid = await form.trigger([
          "title",
          "employmentType",
          "company",
          "location",
        ]);
        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 1: true }));
          setCurrentStage(2);
        }
      } else if (currentStage === 2) {
        // Always validate startDate
        isValid = await form.trigger(["startDate.month", "startDate.year"]);
        if (!isValid) return;

        // Handle validation differently based on isCurrent
        if (isCurrent) {
          isValid = true; // If current position, no need to validate end date
        } else {
          // Validate end date fields
          isValid = await form.trigger(["endDate.month", "endDate.year"]);
        }

        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 2: true }));
          setCurrentStage(3);
        }
      } else if (currentStage === 3) {
        isValid = await form.trigger(["description"]);
        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 3: true }));
          setCurrentStage(4);
        }
      }
    } else if (direction === "prev") {
      if (currentStage > 1) {
        setCurrentStage(currentStage - 1);
      }
    }
  };

  const handleFormSubmit = (data) => {
    setSubmitError(null);
    setShowSuccess(false);
    const updatedData = { ...data, _id: experience?._id };

    handleUserUpdate.mutate(
      {
        api: adding ? "profile/add-experience" : "profile/edit-experience",
        method: adding ? "POST" : "PATCH",
        data: { ...updatedData },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => {
            setSkillInput("");
            setShowSuccess(false);
            setOpen(false);
            setStageValidation({
              1: false,
              2: false,
              3: false,
            });
            setCurrentStage(1);

            // Only reset form values when adding a new experience
            if (adding) {
              setTitle("");
              setEmploymentType("");
              setCompany("");
              setLocation("");
              setStartDate({ month: "", year: "" });
              setEndDate({ month: "", year: "" });
              setIsCurrent(false);
              setDescription("");
              setSkills([]);
            }
            // When editing, we keep the current values
          }, 3000);
        },
        onError: (error) => {
          setSubmitError(
            error?.message ||
              "Failed to save experience information. Please try again."
          );
        },
      }
    );
  };

  const handleDeleteExperience = () => {
    handleUserUpdate.mutate(
      {
        api: "profile/delete-experience",
        method: "DELETE",
        data: { experienceId: experience?._id },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => {
            setSkillInput("");
            setShowSuccess(false);
            setOpen(false);
            setStageValidation({
              1: false,
              2: false,
              3: false,
            });
            setCurrentStage(1);
          }, 3000);
        },
        onError: (error) => {
          setSubmitError(
            error?.message ||
              "Failed to delete experience information. Please try again."
          );
        },
      }
    );
  };

  return (
    <Dialog
      className="min-w-max"
      open={open}
      onOpenChange={setOpen}
      useRegularButton
      buttonData={adding ? <AddButton /> : <EditButton />}
      AlertContent={
        <ModExperiencePresentation
          form={form}
          isCurrent={isCurrent}
          isValid={
            stageValidation[1] && stageValidation[2] && stageValidation[3]
          }
          months={months}
          years={years}
          errors={errors}
          handleFormSubmit={handleFormSubmit}
          addSkill={addSkill}
          removeSkill={removeSkill}
          adding={adding}
          handleSubmit={form.handleSubmit}
          watch={form.watch}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          handleIsCurrent={handleIsCurrent}
          setValue={form.setValue}
          skills={skills}
          isLoading={isLoading}
          submitError={submitError}
          showSuccess={showSuccess}
          setSubmitError={setSubmitError}
          currentStage={currentStage}
          validateStageAndProceed={validateStageAndProceed}
          stageValidation={stageValidation}
          setCurrentStage={setCurrentStage}
          handleDeleteExperience={handleDeleteExperience}
          employmentTypes={employmentTypes}
          stageTitles={stageTitles}
        />
      }
    />
  );
}
