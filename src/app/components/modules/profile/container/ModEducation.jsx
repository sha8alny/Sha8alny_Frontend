"use client";
import Dialog from "@/app/components/ui/DialogMod";
import EditButton from "@/app/components/ui/EditButton";
import ModEducationPresentation from "../presentation/ModEducationPresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

// Form schemas for each stage
const stage1Schema = z.object({
  school: z.string().nonempty("School is required."),
  degree: z.string().nonempty("Degree is required."),
  fieldOfStudy: z.string().nonempty("Field of Study is required."),
  grade: z.string().nonempty("Grade is required."),
});

const stage2Schema = z.object({
  startMonth: z.string().nonempty("Start month is required."),
  startYear: z.string().nonempty("Start year is required."),
  endMonth: z.string().nonempty("End month is required."), // Now always required
  endYear: z.string().nonempty("End year is required."), // Now always required
});

const stage3Schema = z.object({
  activities: z.string().max(500, "Activities is too long.").optional(),
  description: z.string().max(1000, "Description is too long.").optional(),
  skills: z.array(z.string()).default([]),
});

// Combined schema for the complete form
const formSchema = z.object({
  ...stage1Schema.shape,
  ...stage2Schema.shape,
  ...stage3Schema.shape,
});

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
  const [skillInput, setSkillInput] = useState("");
  const [currentStage, setCurrentStage] = useState(1);
  const [stageValidation, setStageValidation] = useState({
    1: false,
    2: false,
    3: false
  });
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const years = generateYears();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: education?.school || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      grade: education?.grade || "",
      startMonth: education?.startDate?.month || "",
      startYear: education?.startDate?.year?.toString() || "",
      endMonth: education?.endDate?.month || "",
      endYear: education?.endDate?.year?.toString() || "",
      activities: education?.activities || "",
      description: education?.description || "",
      skills: education?.skills || [],
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch, formState, trigger } = form;
  const { errors } = formState;
  const skills = watch("skills");
  const handleUserUpdate = useUpdateProfile();
  const isLoading = handleUserUpdate.isPending;

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput && !skills.includes(skillInput)) {
      setValue("skills", [...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill)
    );
  };

  // Validate current stage and move to next or previous
  const validateStageAndProceed = async (direction) => {
    if (direction === 'next') {
      let isValid = false;
      
      if (currentStage === 1) {
        isValid = await trigger(['school', 'degree', 'fieldOfStudy', 'grade']);
        if (isValid) {
          setStageValidation(prev => ({ ...prev, 1: true }));
          setCurrentStage(2);
        }
      } else if (currentStage === 2) {
        // Now always validate all date fields
        const fieldsToValidate = ['startMonth', 'startYear', 'endMonth', 'endYear'];
        
        isValid = await trigger(fieldsToValidate);
        if (isValid) {
          setStageValidation(prev => ({ ...prev, 2: true }));
          setCurrentStage(3);
        }
      } else if (currentStage === 3) {
        isValid = await trigger(['activities', 'description']);
        if (isValid) {
          setStageValidation(prev => ({ ...prev, 3: true }));
          setCurrentStage(4);
        }
      }
    } else if (direction === 'prev') {
      if (currentStage > 1) {
        setCurrentStage(currentStage - 1);
      }
    }
  };

  const deleteEducation = (educationId) => {
    handleUserUpdate.mutate({
      api: "profile/delete-education",
      method: "DELETE",
      data: { educationId },
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        // Optionally auto-hide success message after a few seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      },
      onError: (error) => {
        setSubmitError(error?.message || "Failed to delete education information. Please try again.");
      }
    });
  }

  const handleFormSubmit = (data) => {
    // Reset any previous states
    setSubmitError(null);
    setShowSuccess(false);
    
    const formattedData = {
      ...data,
      _id : education?._id ? education._id : undefined,
      startDate: { month: data.startMonth, year: data.startYear },
      endDate: { month: data.endMonth, year: data.endYear }
    };
    
    handleUserUpdate.mutate({
      api: adding ? "profile/add-education" : "profile/edit",
      method: adding ? "POST" : "PATCH",
      data: { ...formattedData },
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        // Optionally auto-hide success message after a few seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      },
      onError: (error) => {
        setSubmitError(error?.message || "Failed to save education information. Please try again.");
      }
    });
  };

  return (
    <Dialog
      className="min-w-max"
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
          handleSubmit={handleSubmit}
          watch={watch}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          setValue={setValue}
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
