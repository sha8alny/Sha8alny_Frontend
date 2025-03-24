"use client";
import Dialog from "@/app/components/ui/Dialog";
import EditButton from "@/app/components/ui/EditButton";
import ModCertificatePresentation from "../presentation/ModCertificatePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

const formSchema = z
  .object({
    name: z.string().nonempty("Certificate name is required."),
    issuingOrganization: z
      .string()
      .nonempty("Issuing organization is required."),
    issueDate: z.object({
      month: z.string().nonempty("Issue month is required."),
      year: z.string().nonempty("Issue year is required."),
    }),
    expirationDate: z.object({
      month: z.string().nonempty("Expiration month is required."),
      year: z.string().nonempty("Expiration year is required."),
    }),
    neverExpires: z.boolean().default(false),
    skills: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.neverExpires) {
        return true; // No validation needed for expiration date if certificate never expires
      } else {
        return (
          data.expirationDate &&
          data.expirationDate.month &&
          data.expirationDate.year
        );
      }
    },
    {
      message: "Expiration date is required when certificate expires",
      path: ["expirationDate"],
    }
  );

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

export default function ModCertificate({ certificate, adding }) {
  const [skillInput, setSkillInput] = useState("");
  const years = generateYears();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: certificate?.name || "",
      issuingOrganization: certificate?.issuingOrganization || "",
      issueDate: {
        month: certificate?.issueDate?.month || "",
        year: certificate?.issueDate?.year.toString() || "",
      },
      expirationDate: {
        month: certificate?.expirationDate?.month || "",
        year: certificate?.expirationDate?.year.toString() || "",
      },
      neverExpires: certificate?.neverExpires || false,
      skills: certificate?.skills || [],
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch, formState } = form;
  const { errors, isValid } = formState;
  const skills = watch("skills");
  const neverExpires = watch("neverExpires");

  const handleNeverExpires = (value) => {
    setValue("neverExpires", value, { shouldValidate: true });
    if (!value) {
      setValue("expirationDate", { month: "", year: "" }, { shouldValidate: true });
    } else {
      setValue("expirationDate", { month: "January", year: "1900" }, { shouldValidate: true });
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
    updateProfileMutation.mutate({
      api: adding ? "add-certification" : "edit",
      method: adding ? "POST" : "PATCH",
      data: { certificate: data },
    });
  };

  return (
    <Dialog
      useRegularButton
      buttonData={adding ? <AddButton /> : <EditButton />}
      className="min-w-max"
      AlertContent={
        <ModCertificatePresentation
          form={form}
          neverExpires={neverExpires}
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
          handleNeverExpires={handleNeverExpires}
        />
      }
    />
  );
}
