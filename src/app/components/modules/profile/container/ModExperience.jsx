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

const formSchema = z.object({
  title: z.string().nonempty("Job title is required."),
  employmentType: z.string().nonempty("Employment type is required."),
  company: z.string().nonempty("Company is required."),
  location: z.string().nonempty("Location is required."),
  startDate: z.object({
    month: z.string().nonempty("Start month is required."),
    year: z.string().nonempty("Start year is required."),
  }),
  endDate: z.object({
    month: z.string().nonempty("End year is required."),
    year: z.string().nonempty("End year is required."),
  }),
  isCurrent: z.boolean().default(false),
  description: z.string().max(1000, "Description is too long.").optional(),
  skills: z.array(z.string()).default([]),
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
  const years = generateYears();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: experience?.title || "",
      employmentType: experience?.employmentType || "",
      company: experience?.company || "",
      location: experience?.location || "",
      startDate: {
        month: experience?.startDate?.month || "",
        year: experience?.startDate?.year.toString() || "",
      },
      endDate: {
        month: experience?.endDate?.month || "",
        year: experience?.endDate?.year.toString() || "",
      },
      isCurrent: experience?.isCurrent || false,
      description: experience?.description || "",
      skills: experience?.skills || [],
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch, formState } = form;
  const { errors, isValid } = formState;
  const skills = watch("skills");
  const isCurrent = watch("isCurrent");
  const handleUserUpdate = useUpdateProfile();

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

  const handleFormSubmit = (data) => {
    handleUserUpdate.mutate({
      api: adding ? "add-experience" : "edit",
      method: adding ? "POST" : "PATCH",
      data: { experience: [data] },
    });
  };

  return (
    <Dialog
      className="min-w-max"
      useRegularButton
      buttonData={adding ? <AddButton /> : <EditButton />}
      AlertContent={
        <ModExperiencePresentation
          form={form}
          isCurrent={isCurrent}
          isValid={isValid}
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
        />
      }
    />
  );
}