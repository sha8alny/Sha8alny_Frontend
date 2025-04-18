import BackButton from "./BackButton";
import { Button } from "@/app/components/ui/Button";
import SettingsFormLayout from "./SettingsFormLayout";
import ChangeEmailContainer from "../container/ChangeEmailContainer";
import { useState } from "react";
/**
 * @namespace settings
 * @module settings
 */
/**
 * ChangeEmailCard component allows users to change their email address.
 * It displays the current email and provides a form to update it.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.toggleForm - Function to toggle the form visibility
 * @param {string} props.email - The current email address of the user
 * @returns {JSX.Element} The rendered ChangeEmailCard component
 */
const ChangeEmailCard = ({ toggleForm, email }) => {
  const [currentFormPage, setCurrentFormPage] = useState(0);
  const handleContinueForm = () => setCurrentFormPage(1);

  return (
    <SettingsFormLayout>
      {currentFormPage == 1 ? (
        <ChangeEmailContainer toggleForm={toggleForm} />
      ) : (
        <>
          <BackButton handler={toggleForm} />
          <h1 className="text-text text-lg font-semibold">Change email</h1>
          <div className="flex flex-col gap-2">
            <p className="text-text text-md  ">Your current email:</p>
            <p className="text-sm ">{email}</p>
          </div>
          <div className="-ml-2">
            <Button
              type="submit"
              data-testid="update-email-button"
              className="ml-2 w-25 text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
              onClick={handleContinueForm}
            >
              {"Update email"}
            </Button>{" "}
          </div>
        </>
      )}
    </SettingsFormLayout>
  );
};

export default ChangeEmailCard;
