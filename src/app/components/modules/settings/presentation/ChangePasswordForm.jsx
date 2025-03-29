import { useState, useRef, useEffect } from "react";
import { Shield, Close } from "@mui/icons-material";
import SettingsFormLayout from "./SettingsFormLayout";
import BackButton from "./BackButton";
import Button from "./Button";
/**
 * @namespace settings
 * @module settings
 */
/**
 * ChangePasswordForm component allows users to change their password.
 *
 * @component
 * @param {Object} props - The props that are passed to the component.
 * @param {Function} props.toggleForm - Function to toggle the form visibility.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {Function} props.handleChange - Function to handle input changes.
 * @param {Object} props.errors - Object containing error messages for the form fields.
 * @param {Object} props.passwords - Object containing the current, new, and confirm password values.
 * @param {boolean} props.showTooltip - Boolean to control the visibility of the tooltip.
 * @param {Function} props.setShowTooltip - Function to set the visibility of the tooltip.
 * @param {Object} props.tooltipRef - Ref object for the tooltip element.
 * @returns {JSX.Element} The ChangePasswordForm component.
 */

const ChangePasswordForm = ({
  toggleForm,
  handleSubmit,
  handleChange,
  errors,
  passwords,
  showTooltip,
  setShowTooltip,
  tooltipRef,
  handleForgetPassword
}) => {
  

  return (
    <SettingsFormLayout>
      <BackButton handler={toggleForm} />
      <div className="flex flex-col gap-1">
        <h1 className="text-text text-xl font-semibold">Change Password</h1>
        <p className="text-sm">
          Create a new password that is at least 8 characters long.
        </p>

        <div className="relative w-max">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-sm text-secondary w-max rounded-full hover:bg-[#0A66C233] p-2 cursor-pointer flex flex-row gap-2 items-center"
          >
            <Shield /> What makes a strong password?
          </button>

          {showTooltip && (
            <div
              ref={tooltipRef}
              className="absolute left-0 top-full mt-2 w-80 bg-background text-text rounded-lg p-4 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  Choose a strong password
                </h3>
                <button onClick={() => setShowTooltip(false)}>
                  <Close
                    size={18}
                    className=" cursor-pointer hover:text-secondary"
                  />
                </button>
              </div>
              <ul className="mt-2 text-sm flex flex-col gap-2 list-none ">
                <li>
                  It <b>should</b> be a mix of letters, numbers, and special
                  characters.
                </li>
                <li>
                  It <b>should</b> be at least 8 characters long.
                </li>
                <li>
                  It <b>should not</b> contain your name, phone number, or email
                  address.
                </li>
              </ul>
            </div>
          )}
        </div>

        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <label className="text-sm text-text flex" htmlFor="currentPassword">
            Type your current password{" "}
            <span className="ml-1 text-red-500"> *</span>
          </label>
          <input
            className="bg-background rounded-lg p-1"
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
            required
          />
          {errors.currPassError && (
            <p className="text-red-500">{errors.currPassError}</p>
          )}

          <label className="text-sm text-text flex" htmlFor="newPassword">
            Type your new password <span className="ml-1 text-red-500"> *</span>
          </label>
          <input
            className="bg-background rounded-lg p-1"
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassError && (
            <p className="text-red-500">{errors.newPassError}</p>
          )}

          <label className="text-sm text-text flex" htmlFor="confirmPassword">
            Retype the password{" "}
            <span className="ml-1 text-red-500"> *</span>
          </label>
          <input
            className="bg-background rounded-lg p-1"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassError && (
            <p className="text-red-500">{errors.confirmPassError}</p>
          )}

          <Button
            content="Save Password"
            handler={handleSubmit}
            disabled={
              !passwords.currentPassword ||
              !passwords.newPassword ||
              !passwords.confirmPassword
            }
          />
        </form>
          <button onClick={handleForgetPassword} className="cursor-pointer w-max hover:text-secondary p-2 rounded-lg">
            Forgot Password
          </button>
      </div>
    </SettingsFormLayout>
  );
};

export default ChangePasswordForm;
