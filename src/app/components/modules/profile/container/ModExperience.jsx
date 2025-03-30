"use client";
import Dialog from "@/app/components/ui/DialogMod";
import EditButton from "@/app/components/ui/EditButton";
import ModExperiencePresentation from "../presentation/ModExperiencePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

// Form schemas for each stage
const stage1Schema = z.object({
  title: z.string().nonempty("Job title is required."),
  employmentType: z.string().nonempty("Employment type is required."),
  company: z.string().nonempty("Company is required."),
  location: z.string().nonempty("Location is required."),
});

const stage2Schema = z.object({
  startDate: z.object({
    month: z.string().nonempty("Start month is required."),
    year: z.string().nonempty("Start year is required."),
  }),
  endDate: z.object({
    month: z.string().nonempty("End month is required."),
    year: z.string().nonempty("End year is required."),
  }),
  isCurrent: z.boolean().default(false),
});

const stage3Schema = z.object({
  description: z.string().max(1000, "Description is too long.").optional(),
  skills: z.array(z.string()).default([]),
});

// Combined schema for the complete form
const formSchema = z.object({
  ...stage1Schema.shape,
  ...stage2Schema.shape,
  ...stage3Schema.shape,
});

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
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
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const years = generateYears();

  const jobTypes = {
    "Full-time": "fullTime",
    "Part-time": "partTime",
    "Internship": "internship",
    "Freelance": "freelance",
    "Contract": "contract",
    "Apprenticeship": "apprenticeship",
    "Seasonal": "seasonal",
    "Self-employed": "selfEmployed",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: experience?.title || "",
      employmentType: experience?.employmentType || "",
      company: experience?.company || "",
      location: experience?.location || "",
      startDate: {
        month: experience?.startDate?.month || "",
        year: experience?.startDate?.year
          ? experience.startDate.year.toString()
          : "",
      },
      endDate: {
        month: experience?.endDate?.month || "",
        year: experience?.endDate?.year
          ? experience.endDate.year.toString()
          : "",
      },
      isCurrent: experience?.isCurrent || false,
      description: experience?.description || "",
      skills: experience?.skills || [],
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch, formState, trigger } = form;
  const { errors } = formState;
  const skills = watch("skills");
  const isCurrent = watch("isCurrent");
  const handleUserUpdate = useUpdateProfile();
  const isLoading = handleUserUpdate.isPending;

  const handleIsCurrent = (value) => {
    setValue("isCurrent", value, { shouldValidate: true });
    if (!value) {
      setValue("endDate", { month: "", year: "" }, { shouldValidate: true });
    } else {
      setValue(
        "endDate",
        { month: "January", year: "1900" },
        { shouldValidate: true }
      );
    }
  };

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
    if (direction === "next") {
      let isValid = false;

      if (currentStage === 1) {
        isValid = await trigger([
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
        const fieldsToValidate = ["startDate.month", "startDate.year"];
        if (!isCurrent) {
          fieldsToValidate.push("endDate.month", "endDate.year");
        }

        isValid = await trigger(fieldsToValidate);
        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 2: true }));
          setCurrentStage(3);
        }
      } else if (currentStage === 3) {
        isValid = await trigger(["description"]);
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
    const updatedData = { ...data , _id: experience?._id };
    console.log("updatedData", updatedData);
    handleUserUpdate.mutate(
      {
        api: adding ? "profile/add-experience" : "profile/edit",
        method: adding ? "POST" : "PATCH",
        data: { ...updatedData },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => {
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
              "Failed to save experience information. Please try again."
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
          handleIsCurrent={handleIsCurrent}
          setValue={setValue}
          skills={skills}
          isLoading={isLoading}
          submitError={submitError}
          showSuccess={showSuccess}
          setSubmitError={setSubmitError}
          currentStage={currentStage}
          validateStageAndProceed={validateStageAndProceed}
          stageValidation={stageValidation}
          setCurrentStage={setCurrentStage}
        />
      }
    />
  );
}