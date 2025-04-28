"use client";
import Dialog from "@/app/components/ui/DialogMod";
import EditButton from "@/app/components/ui/EditButton";
import ModCertificatePresentation from "../presentation/ModCertificatePresentation";
import AddButton from "@/app/components/ui/AddButton";
import { useState, useEffect } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

/**
 * @namespace profile
 * @module profile
 */

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

  // Form data state
  const [name, setName] = useState(certificate?.name || "");
  const [issuingOrganization, setIssuingOrganization] = useState(
    certificate?.issuingOrganization || ""
  );
  const [certificateUrl, setCertificateUrl] = useState(
    certificate?.certificateUrl || ""
  );
  const [issueDate, setIssueDate] = useState({
    month: certificate?.issueDate?.month || "",
    year: certificate?.issueDate?.year?.toString() || "",
  });
  const [expirationDate, setExpirationDate] = useState({
    month: certificate?.expirationDate?.month || "",
    year: certificate?.expirationDate?.year?.toString() || "",
  });
  const [neverExpires, setNeverExpires] = useState(
    certificate?.expirationDate === null ? true : false
  );
  const [skills, setSkills] = useState(certificate?.skills || []);

  // Error states
  const [nameError, setNameError] = useState(null);
  const [issuingOrganizationError, setIssuingOrganizationError] =
    useState(null);
  const [certificateUrlError, setCertificateUrlError] = useState(null);
  const [issueDateError, setIssueDateError] = useState(null);
  const [expirationDateError, setExpirationDateError] = useState(null);
  const [skillsError, setSkillsError] = useState(null);

  // UI states
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const years = generateYears();
  const updateProfileMutation = useUpdateProfile();
  const isLoading = updateProfileMutation.isPending || false;


  // Create errors object to mimic react-hook-form error structure
  const errors = {
    name: nameError,
    issuingOrganization: issuingOrganizationError,
    certificateUrl: certificateUrlError,
    issueDate: {
      month: issueDateError?.month,
      year: issueDateError?.year,
    },
    expirationDate: expirationDateError,
    skills: skillsError,
  };

  // Create form object to mimic react-hook-form
  const form = {
    handleSubmit: (callback) => (e) => {
      e?.preventDefault();
      const formData = {
        name,
        issuingOrganization,
        certificateUrl,
        issueDate,
        expirationDate: neverExpires ? null : expirationDate,
        skills,
      };
      callback(formData);
    },
    setValue: (fieldName, value) => {
      setModified(true);
      if (fieldName === "name") setName(value);
      else if (fieldName === "issuingOrganization")
        setIssuingOrganization(value);
      else if (fieldName.startsWith("issueDate.")) {
        const field = fieldName.split(".")[1];
        setIssueDate((prev) => ({ ...prev, [field]: value }));
      } else if (fieldName.startsWith("expirationDate.")) {
        const field = fieldName.split(".")[1];
        setExpirationDate((prev) => ({ ...prev, [field]: value }));
      } else if (fieldName === "skills") setSkills(value);
      else if (fieldName === "certificateUrl") setCertificateUrl(value);
    },
    watch: (fieldName) => {
      if (!fieldName) {
        return {
          name,
          issuingOrganization,
          issueDate,
          certificateUrl,
          expirationDate: neverExpires ? null : expirationDate,
          skills,
        };
      }
      if (fieldName === "name") return name; // Now correctly returns state variable
      if (fieldName === "issuingOrganization") return issuingOrganization;
      if (fieldName === "issueDate") return issueDate;
      if (fieldName === "certificateUrl") return certificateUrl;
      if (fieldName === "expirationDate")
        return neverExpires ? null : expirationDate;
      if (fieldName === "skills") return skills;

      // Handle nested properties
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        if (parent === "issueDate") return issueDate[child];
        if (parent === "expirationDate") return expirationDate[child];
      }

      return undefined;
    },
    formState: { errors },
    trigger: async (fields) => {
      // Validate specific fields
      let isValid = true;

      for (const field of fields) {
        if (field === "issueDate.month" && !issueDate.month) {
          setIssueDateError((prev) => ({
            ...prev,
            month: "Issue month is required",
          }));
          isValid = false;
        }

        if (field === "issueDate.year" && !issueDate.year) {
          setIssueDateError((prev) => ({
            ...prev,
            year: "Issue year is required",
          }));
          isValid = false;
        }

        if (
          field === "expirationDate.month" &&
          !neverExpires &&
          !expirationDate.month
        ) {
          setExpirationDateError("Expiration month is required");
          isValid = false;
        }

        if (
          field === "expirationDate.year" &&
          !neverExpires &&
          !expirationDate.year
        ) {
          setExpirationDateError("Expiration year is required");
          isValid = false;
        }
      }

      // Validate expiration date is after issue date if both are present
      if (
        !neverExpires &&
        issueDate.year &&
        issueDate.month &&
        expirationDate.year &&
        expirationDate.month
      ) {
        const issueYear = parseInt(issueDate.year);
        const expirationYear = parseInt(expirationDate.year);

        if (issueYear > expirationYear) {
          setExpirationDateError("Expiration date must be after issue date");
          isValid = false;
        } else if (issueYear === expirationYear) {
          const issueMonthIndex = months.indexOf(issueDate.month);
          const expirationMonthIndex = months.indexOf(expirationDate.month);

          if (issueMonthIndex > expirationMonthIndex) {
            setExpirationDateError("Expiration date must be after issue date");
            isValid = false;
          }
        }
      }

      return isValid;
    },
  };

  const handleNeverExpires = (value) => {
    setNeverExpires(value);
    if (value) {
      setExpirationDate({ month: "", year: "" });
      setExpirationDateError(null);
    } else {
      setExpirationDate({
        month: expirationDate.month || "",
        year: expirationDate.year || "",
      });
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput && !skills.includes(skillInput)) {
      setSkills((prev) => [...prev, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Validate current stage and move to next or previous
  const validateStageAndProceed = async (direction) => {
    if (direction === "next") {
      let isValid = false;

      if (currentStage === 1) {
        // Reset errors
        setNameError(null);
        setIssuingOrganizationError(null);

        // Validate name
        if (!name) {
          setNameError("Name is required.");
          isValid = false;
        } else if (name.length < 2 || name.length > 50) {
          setNameError("Name must be between 2 and 50 characters.");
          isValid = false;
        } else {
          isValid = true;
        }

        // Validate issuing organization
        if (!issuingOrganization) {
          setIssuingOrganizationError("Issuing organization is required.");
          isValid = false;
        } else if (
          issuingOrganization.length < 2 ||
          issuingOrganization.length > 50
        ) {
          setIssuingOrganizationError(
            "Issuing organization must be between 2 and 50 characters."
          );
          isValid = false;
        } else if (isValid) {
          // Only keep valid if name is also valid
          isValid = true;
        }

        if (isValid) {
          setStageValidation((prev) => ({ ...prev, 1: true }));
          setCurrentStage(2);
        }
      } else if (currentStage === 2) {
        // Reset date errors
        setIssueDateError(null);
        setExpirationDateError(null);

        const fieldsToValidate = ["issueDate.month", "issueDate.year"];
        if (!neverExpires) {
          fieldsToValidate.push("expirationDate.month", "expirationDate.year");
        }

        isValid = await form.trigger(fieldsToValidate);
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
      issueDate,
      expirationDate: neverExpires ? null : expirationDate,
      skills,
      _id: certificate?._id,
    };

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

            // Only reset form values when adding a new certificate
            if (adding) {
              setName("");
              setIssuingOrganization("");
              setIssueDate({ month: "", year: "" });
              setExpirationDate({ month: "", year: "" });
              setNeverExpires(false);
              setSkills([]);
            }
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
      testId={adding ? "add-button" : "edit-certificate-" + certificate?._id}
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
          handleSubmit={form.handleSubmit}
          watch={form.watch}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          setValue={form.setValue}
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
