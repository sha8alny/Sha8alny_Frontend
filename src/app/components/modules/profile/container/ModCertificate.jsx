"use client";
import Dialog from "@/app/components/ui/DialogMod";
import EditButton from "@/app/components/ui/EditButton";
import ModCertificatePresentation from "../presentation/ModCertificatePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Zod schema for certificate form validation.
 * @typedef {Object} CertificateFormSchema
 * @property {string} name - Certificate name (required)
 * @property {string} issuingOrganization - Organization that issued the certificate (required)
 * @property {Object} issueDate - Date when certificate was issued
 * @property {string} issueDate.month - Month when certificate was issued (required)
 * @property {string} issueDate.year - Year when certificate was issued (required)
 * @property {Object} expirationDate - Date when certificate expires (required if neverExpires is false)
 * @property {string} expirationDate.month - Month when certificate expires
 * @property {string} expirationDate.year - Year when certificate expires
 * @property {boolean} neverExpires - Flag indicating if the certificate has no expiration date (default: false)
 * @property {Array<string>} skills - List of skills associated with this certificate (default: [])
 * 
 * Includes refinement to ensure expirationDate is provided when neverExpires is false.
 */
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
 * Certificate management component for adding, editing certification details in profile.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.certificate] - Certificate data object for editing, undefined when adding new
 * @param {boolean} props.adding - Flag indicating if this is an add operation (true) or edit operation (false)
 * 
 * @returns {JSX.Element} Dialog component with certificate form
 * 
 * @example
 * // For adding a new certificate
 * <ModCertificate adding={true} />
 * 
 * // For editing an existing certificate
 * <ModCertificate certificate={certificateData} adding={false} />
 */
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
