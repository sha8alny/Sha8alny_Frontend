import BackButton from "./BackButton";
import Button from "./Button";
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
        <ChangeEmailContainer toggleForm={toggleForm}/>
      ) : (
        <>
          <BackButton handler={toggleForm} />
          <h1 className="text-text text-xl font-semibold">Change email</h1>
          <div className="flex flex-col gap-2">
            <p className="text-text text-lg ">Emails you've added</p>
            <p>{email}</p>
          </div>
        <div className="-ml-2">

          <Button content="Update email address" handler={handleContinueForm} />
        </div>
        </>
      )}
    </SettingsFormLayout>
  );
};

export default ChangeEmailCard;
