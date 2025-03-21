'use client';
import Dialog from "@/app/components/ui/Dialog";
import EditButton from "@/app/components/ui/EditButton";
import ModCertificatePresentation from "../presentation/ModCertificatePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().nonempty("Certificate name is required."),
  issuingOrganization: z.string().nonempty("Issuing organization is required."),
  issueDate: z.object({
    month: z.string().nonempty("Issue month is required."),
    year: z.number().int().positive("Issue year is required"),
  }),
  expirationDate: z.object({
    month: z.string().optional(),
    year: z.number().int().optional(),
  }),
  neverExpires: z.boolean().default(false),
  skills: z.array(z.string()).default([]),
});

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const futureYears = 10; // Allow setting expiration dates up to 10 years in the future
  return Array.from({ length: 50 + futureYears }, (_, i) => ((currentYear + futureYears) - i).toString());
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

export default function ModCertificate({ certificate, adding  }) {
  const [skillInput, setSkillInput] = useState("");
  const years = generateYears();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: certificate?.name || "",
      issuingOrganization: certificate?.issuingOrganization || "",
      issueDate: {
        month: certificate?.issueDate?.month || null,
        year: certificate?.issueDate?.year || null,
      },
      expirationDate: certificate?.neverExpires ? null : {
        month: certificate?.expirationDate?.month || null,
        year: certificate?.expirationDate?.year || null,
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
    //Handle expiry date
    if (data.neverExpires) {
      data.expirationDate = null;
    }
    console.log(data);
    //onSubmit(data);
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
        />
      }
    />
  );
}