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

// Form schemas for each stage
const stage1Schema = z.object({
  name: z.string().nonempty("Certificate name is required."),
  issuingOrganization: z.string().nonempty("Issuing organization is required."),
});

const stage2Schema = z
  .object({
    issueDate: z.object({
      month: z.string().nonempty("Issue month is required."),
      year: z.string().nonempty("Issue year is required."),
    }),
    expirationDate: z.union([
      z.null(),
      z.object({
        month: z.string().nonempty("Expiration month is required."),
        year: z.string().nonempty("Expiration year is required."),
      }),
    ]),
    neverExpires: z.boolean().default(false),
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

const stage3Schema = z.object({
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
 * Certificate management component for adding, editing certification details in profile.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.certificate] - Certificate data object for editing, undefined when adding new
 * @param {boolean} props.adding - Flag indicating if this is an add operation (true) or edit operation (false)
 *
 * @returns {JSX.Element} Dialog component with multi-stage certificate form
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
  const updateProfileMutation = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: certificate?.name || "",
      issuingOrganization: certificate?.issuingOrganization || "",
      issueDate: {
        month: certificate?.issueDate?.month || "",
        year: certificate?.issueDate?.year?.toString() || "",
      },
      expirationDate: {
        month: certificate?.expirationDate?.month || "",
        year: certificate?.expirationDate?.year?.toString() || "",
      },
      neverExpires: certificate?.expirationDate === null ? true : false,
      skills: certificate?.skills || [],
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch, formState, trigger } = form;
  const { errors } = formState;
  const skills = watch("skills");
  const neverExpires = watch("neverExpires");
  const isLoading = updateProfileMutation.isPending;

  const handleNeverExpires = (value) => {
    setValue("neverExpires", value, { shouldValidate: true });
    if (value) {
      setValue("expirationDate", null, { shouldValidate: true });
    } else {
      setValue(
        "expirationDate",
        { month: "", year: "" },
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
        isValid = await trigger(["name", "issuingOrganization"]);
        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 1: true }));
          setCurrentStage(2);
        }
      } else if (currentStage === 2) {
        const fieldsToValidate = ["issueDate.month", "issueDate.year"];
        if (!neverExpires) {
          fieldsToValidate.push("expirationDate.month", "expirationDate.year");
        }

        isValid = await trigger(fieldsToValidate);
        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 2: true }));
          setCurrentStage(3);
        }
      } else if (currentStage === 3) {
        // Skills are optional, so we can just mark this stage as valid
        setStageValidation((prev) => ({ ...prev, 3: true }));
        setCurrentStage(4);
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
    const updatedData = {
      ...data,
      issueDate: watch("issueDate"),
      expirationDate: watch("expirationDate"),
      _id: certificate?._id,
    }
    updateProfileMutation.mutate(
      {
        api: adding
          ? "profile/add-certification"
          : "profile/edit-certification",
        method: adding ? "POST" : "PATCH",
        data: updatedData,
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
              "Failed to save certificate information. Please try again."
          );
        },
      }
    );
  };

  const handleDeleteCertificate = () => {
    updateProfileMutation.mutate(
      {
        api: "profile/delete-certification",
        method: "DELETE",
        data: { certificationId: certificate?._id },
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
              "Failed to delete certificate information. Please try again."
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
        <ModCertificatePresentation
          form={form}
          neverExpires={neverExpires}
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
          handleSubmit={handleSubmit}
          watch={watch}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          setValue={setValue}
          skills={skills}
          handleNeverExpires={handleNeverExpires}
          isLoading={isLoading}
          submitError={submitError}
          showSuccess={showSuccess}
          setSubmitError={setSubmitError}
          currentStage={currentStage}
          validateStageAndProceed={validateStageAndProceed}
          stageValidation={stageValidation}
          setCurrentStage={setCurrentStage}
          handleDeleteCertificate={handleDeleteCertificate}
        />
      }
    />
  );
}
