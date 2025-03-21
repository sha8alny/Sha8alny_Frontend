'use client';
import Dialog from "@/app/components/ui/Dialog";
import EditButton from "@/app/components/ui/EditButton";
import ModExperiencePresentation from "../presentation/ModExperiencePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().nonempty("Job title is required."),
  employmentType: z.string().nonempty("Employment type is required."),
  company: z.string().nonempty("Company is required."),
  location: z.string().nonempty("Location is required."),
  startDate: z.object({
    month: z.string().nonempty("Start month is required."),
    year: z.number().int().positive("Start year is required"),
  }),
  endDate: z.object({
    month: z.string().optional(),
    year: z.number().int().optional(),
  }).optional().nullable(),
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

export default function ModExperience({ experience, adding }) {
  const [skillInput, setSkillInput] = useState("");
  const years = generateYears();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: experience?.title || "",
      employmentType: experience?.employmentType || null,
      company: experience?.company || "",
      location: experience?.location || "",
      startDate: {
        month: experience?.startDate?.month || null,
        year: experience?.startDate?.year || null,
      },
      endMonth: experience?.isCurrent ? null : {
        month: experience?.endDate?.month || null,
        year: experience?.endDate?.year || null,
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
    // No need for additional formatting since the form structure already matches
    // the data structure we want
    onSubmit(data);
  };

  return (
    <Dialog
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
          setValue={setValue}
          skills={skills}
        />
      }
    />
  );
}