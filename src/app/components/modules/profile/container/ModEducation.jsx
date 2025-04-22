"use client";
import Dialog from "@/app/components/ui/DialogMod";
import EditButton from "@/app/components/ui/EditButton";
import ModEducationPresentation from "../presentation/ModEducationPresentation";
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

/**
 * Generates an array of years starting from 50 years in the past up to 10 years in the future.
 *
 * @returns {string[]} An array of years as strings, sorted in descending order.
 */
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const futureYears = 10;
  return Array.from({ length: 50 + futureYears }, (_, i) =>
    (currentYear + futureYears - i).toString()
  );
};

/**
 * @namespace profile
 * @module profile
 */
/**
 * ModEducation component that handles the education modal functionality.
 * It provides a multi-stage form for adding or editing education information.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.education] - The education object to edit, if editing
 * @param {boolean} props.adding - Flag indicating whether adding new education or editing existing one
 * @returns {JSX.Element} Dialog component with education form
 */
export default function ModEducation({ education, adding }) {
  const [open, setOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [currentStage, setCurrentStage] = useState(1);
  const [stageValidation, setStageValidation] = useState({
    1: false,
    2: false,
    3: false,
  });

  // Form data states
  const [school, setSchool] = useState(education?.school || "");
  const [degree, setDegree] = useState(education?.degree || "");
  const [fieldOfStudy, setFieldOfStudy] = useState(education?.fieldOfStudy || "");
  const [grade, setGrade] = useState(education?.grade || "");
  const [startMonth, setStartMonth] = useState(education?.startDate?.month || "");
  const [startYear, setStartYear] = useState(education?.startDate?.year?.toString() || "");
  const [endMonth, setEndMonth] = useState(education?.endDate?.month || "");
  const [endYear, setEndYear] = useState(education?.endDate?.year?.toString() || "");
  const [activities, setActivities] = useState(education?.activities || "");
  const [description, setDescription] = useState(education?.description || "");
  const [skills, setSkills] = useState(education?.skills || []);

  // Error states
  const [schoolError, setSchoolError] = useState(null);
  const [degreeError, setDegreeError] = useState(null);
  const [fieldOfStudyError, setFieldOfStudyError] = useState(null);
  const [gradeError, setGradeError] = useState(null);
  const [startMonthError, setStartMonthError] = useState(null);
  const [startYearError, setStartYearError] = useState(null);
  const [endMonthError, setEndMonthError] = useState(null);
  const [endYearError, setEndYearError] = useState(null);
  const [activitiesError, setActivitiesError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);

  // UI states
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const years = generateYears();

  const handleUserUpdate = useUpdateProfile();
  const isLoading = handleUserUpdate.isPending;

  // Create errors object to mimic react-hook-form error structure
  const errors = {
    school: schoolError,
    degree: degreeError,
    fieldOfStudy: fieldOfStudyError,
    grade: gradeError,
    startMonth: startMonthError,
    startYear: startYearError,
    endMonth: endMonthError,
    endYear: endYearError,
    activities: activitiesError,
    description: descriptionError,
  };

  // Create form object to mimic react-hook-form
  const form = {
    handleSubmit: (callback) => (e) => {
      e?.preventDefault();
      const formData = {
        school,
        degree,
        fieldOfStudy,
        grade,
        startMonth,
        startYear,
        endMonth,
        endYear,
        activities,
        description,
        skills,
      };
      callback(formData);
    },
    setValue: (fieldName, value) => {
      if (fieldName === "school") setSchool(value);
      else if (fieldName === "degree") setDegree(value);
      else if (fieldName === "fieldOfStudy") setFieldOfStudy(value);
      else if (fieldName === "grade") setGrade(value);
      else if (fieldName === "startMonth") setStartMonth(value);
      else if (fieldName === "startYear") setStartYear(value);
      else if (fieldName === "endMonth") setEndMonth(value);
      else if (fieldName === "endYear") setEndYear(value);
      else if (fieldName === "activities") setActivities(value);
      else if (fieldName === "description") setDescription(value);
      else if (fieldName === "skills") setSkills(value);
    },
    watch: (fieldName) => {
      if (!fieldName) {
        return {
          school,
          degree,
          fieldOfStudy,
          grade,
          startMonth,
          startYear,
          endMonth,
          endYear,
          activities,
          description,
          skills,
        };
      }
      if (fieldName === "school") return school;
      if (fieldName === "degree") return degree;
      if (fieldName === "fieldOfStudy") return fieldOfStudy;
      if (fieldName === "grade") return grade;
      if (fieldName === "startMonth") return startMonth;
      if (fieldName === "startYear") return startYear;
      if (fieldName === "endMonth") return endMonth;
      if (fieldName === "endYear") return endYear;
      if (fieldName === "activities") return activities;
      if (fieldName === "description") return description;
      if (fieldName === "skills") return skills;
      return undefined;
    },
    formState: { errors },
    trigger: async (fields) => {
      let isValid = true;

      // Reset errors for the fields we're validating
      if (Array.isArray(fields)) {
        if (fields.includes("school")) setSchoolError(null);
        if (fields.includes("degree")) setDegreeError(null);
        if (fields.includes("fieldOfStudy")) setFieldOfStudyError(null);
        if (fields.includes("grade")) setGradeError(null);
        if (fields.includes("startMonth")) setStartMonthError(null);
        if (fields.includes("startYear")) setStartYearError(null);
        if (fields.includes("endMonth")) setEndMonthError(null);
        if (fields.includes("endYear")) setEndYearError(null);
        if (fields.includes("activities")) setActivitiesError(null);
        if (fields.includes("description")) setDescriptionError(null);
      }

      // Stage 1 validation
      if (fields.includes("school") && !school) {
        setSchoolError("School is required.");
        isValid = false;
      }

      if (fields.includes("degree") && !degree) {
        setDegreeError("Degree is required.");
        isValid = false;
      }

      if (fields.includes("fieldOfStudy") && !fieldOfStudy) {
        setFieldOfStudyError("Field of Study is required.");
        isValid = false;
      }

      if (fields.includes("grade") && !grade) {
        setGradeError("Grade is required.");
        isValid = false;
      }

      // Stage 2 validation
      if (fields.includes("startMonth") && !startMonth) {
        setStartMonthError("Start month is required.");
        isValid = false;
      }

      if (fields.includes("startYear") && !startYear) {
        setStartYearError("Start year is required.");
        isValid = false;
      }

      if (fields.includes("endMonth") && !endMonth) {
        setEndMonthError("End month is required.");
        isValid = false;
      }

      if (fields.includes("endYear") && !endYear) {
        setEndYearError("End year is required.");
        isValid = false;
      }

      // Date comparison validation
      if (
        fields.some(field => ["startMonth", "startYear", "endMonth", "endYear"].includes(field)) &&
        startYear && startMonth && endYear && endMonth
      ) {
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);

        if (startYearNum > endYearNum) {
          setEndYearError("End date cannot be before start date.");
          setEndMonthError("End date cannot be before start date.");
          isValid = false;
        } else if (startYearNum === endYearNum) {
          const monthIndex = (month) => months.findIndex((m) => m === month);
          const startMonthIndex = monthIndex(startMonth);
          const endMonthIndex = monthIndex(endMonth);

          if (startMonthIndex > endMonthIndex) {
            setEndMonthError("End date cannot be before start date.");
            isValid = false;
          }
        }
      }

      // Stage 3 validation
      if (fields.includes("activities") && activities && activities.length > 500) {
        setActivitiesError("Activities is too long.");
        isValid = false;
      }

      if (fields.includes("description") && description && description.length > 1000) {
        setDescriptionError("Description is too long.");
        isValid = false;
      }

      return isValid;
    },
    getValues: () => ({
      school,
      degree,
      fieldOfStudy,
      grade,
      startMonth,
      startYear,
      endMonth,
      endYear,
      activities,
      description,
      skills,
    }),
    setError: (field, error) => {
      if (field === "school") setSchoolError(error.message);
      else if (field === "degree") setDegreeError(error.message);
      else if (field === "fieldOfStudy") setFieldOfStudyError(error.message);
      else if (field === "grade") setGradeError(error.message);
      else if (field === "startMonth") setStartMonthError(error.message);
      else if (field === "startYear") setStartYearError(error.message);
      else if (field === "endMonth") setEndMonthError(error.message);
      else if (field === "endYear") setEndYearError(error.message);
      else if (field === "activities") setActivitiesError(error.message);
      else if (field === "description") setDescriptionError(error.message);
    },
    reset: (values) => {
      setSchool(values?.school || "");
      setDegree(values?.degree || "");
      setFieldOfStudy(values?.fieldOfStudy || "");
      setGrade(values?.grade || "");
      setStartMonth(values?.startMonth || "");
      setStartYear(values?.startYear || "");
      setEndMonth(values?.endMonth || "");
      setEndYear(values?.endYear || "");
      setActivities(values?.activities || "");
      setDescription(values?.description || "");
      setSkills(values?.skills || []);

      // Clear errors
      setSchoolError(null);
      setDegreeError(null);
      setFieldOfStudyError(null);
      setGradeError(null);
      setStartMonthError(null);
      setStartYearError(null);
      setEndMonthError(null);
      setEndYearError(null);
      setActivitiesError(null);
      setDescriptionError(null);
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput && !skills.includes(skillInput)) {
      setSkills(prev => [...prev, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  // Validate current stage and move to next or previous
  const validateStageAndProceed = async (direction) => {
    if (direction === "next") {
      let isValid = false;

      if (currentStage === 1) {
        isValid = await form.trigger(["school", "degree", "fieldOfStudy", "grade"]);
        if (isValid) {
          setStageValidation(prev => ({ ...prev, 1: true }));
          setCurrentStage(2);
        }
      } else if (currentStage === 2) {
        // Now always validate all date fields
        const fieldsToValidate = [
          "startMonth",
          "startYear",
          "endMonth",
          "endYear",
        ];

        isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
          setStageValidation(prev => ({ ...prev, 2: true }));
          setCurrentStage(3);
        }
      } else if (currentStage === 3) {
        isValid = await form.trigger(["activities", "description"]);
        if (isValid) {
          setStageValidation(prev => ({ ...prev, 3: true }));
          setCurrentStage(4);
        }
      }
    } else if (direction === "prev") {
      if (currentStage > 1) {
        setCurrentStage(currentStage - 1);
      }
    }
  };

  const deleteEducation = (educationId) => {
    handleUserUpdate.mutate(
      {
        api: "profile/delete-education",
        method: "DELETE",
        data: { educationId },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          // Optionally auto-hide success message after a few seconds
          setTimeout(() => {
            setShowSuccess(false);
            setOpen(false);
          }, 3000);
        },
        onError: (error) => {
          setSubmitError(
            error?.message ||
              "Failed to delete education information. Please try again."
          );
        },
      }
    );
  };

  const handleFormSubmit = (data) => {
    // Reset any previous states
    setSubmitError(null);
    setShowSuccess(false);

    const formattedData = {
      ...data,
      _id: education?._id ? education._id : undefined,
      startDate: { month: data.startMonth, year: data.startYear },
      endDate: { month: data.endMonth, year: data.endYear },
    };

    handleUserUpdate.mutate(
      {
        api: adding ? "profile/add-education" : "profile/edit-education",
        method: adding ? "POST" : "PATCH",
        data: { ...formattedData },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          // Optionally auto-hide success message after a few seconds
          setTimeout(() => {
            setShowSuccess(false);
            setOpen(false);
            setStageValidation({
              1: false,
              2: false,
              3: false,
            });
            setCurrentStage(1);

            // Only reset form values when adding a new education
            if (adding) {
              setSchool("");
              setDegree("");
              setFieldOfStudy("");
              setGrade("");
              setStartMonth("");
              setStartYear("");
              setEndMonth("");
              setEndYear("");
              setActivities("");
              setDescription("");
              setSkills([]);
            }
            // When editing, we keep the current values
          }, 3000);
        },
        onError: (error) => {
          setSubmitError(
            error?.message ||
              "Failed to save education information. Please try again."
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
        <ModEducationPresentation
          form={form}
          isValid={stageValidation[1] && stageValidation[2] && stageValidation[3]}
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
          setValue={form.setValue}
          skills={skills}
          isLoading={isLoading}
          submitError={submitError}
          showSuccess={showSuccess}
          setSubmitError={setSubmitError}
          deleteEducation={deleteEducation}
          educationId={education?._id}
          currentStage={currentStage}
          validateStageAndProceed={validateStageAndProceed}
          stageValidation={stageValidation}
        />
      }
    />
  );
}
