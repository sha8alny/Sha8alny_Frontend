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

const formSchema = z.object({
  school: z.string().nonempty("School is required."),
  degree: z.string().nonempty("Degree is required."),
  fieldOfStudy: z.string().nonempty("Field of Study is required."),
  grade: z.string().nonempty("Grade is required."),
  startMonth: z.string().nonempty("Start month is required."),
  startYear: z.string().nonempty("Start year is required."),
  endMonth: z.string().nonempty("End month is required."),
  endYear: z.string().nonempty("End year is required."),
  isCurrent: z.boolean().default(false),
  activities: z.string().max(500, "Activities is too long.").optional(),
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

export default function ModEducation({ education, adding }) {
  const [skillInput, setSkillInput] = useState("");
  const years = generateYears();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: education?.school || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      grade: education?.grade || "",
      startMonth: education?.startDate?.month || "",
      startYear: education?.startDate?.year.toString() || "",
      endMonth: education?.endDate?.month || "",
      endYear: education?.endDate?.year.toString() || "",
      isCurrent: education?.isCurrent || false,
      activities: education?.activities || "",
      description: education?.description || "",
      skills: education?.skills || [],
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
      setValue("endMonth", "", { shouldValidate: true });
      setValue("endYear", "", { shouldValidate: true });
    } else {
      setValue("endMonth", "January", { shouldValidate: true });
      setValue("endYear", "1900", { shouldValidate: true });
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
    const formattedData = {
      ...data,
      startDate: { month: data.startMonth, year: data.startYear },
      endDate: data.isCurrent
        ? null
        : { month: data.endMonth, year: data.endYear },
    };
    handleUserUpdate.mutate({
      api: adding ? "add-education" : "edit",
      method: adding ? "POST" : "PATCH",
      data: { education: [formattedData] },
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
          handleIsCurrent={handleIsCurrent}
        />
      }
    />
  );
}
