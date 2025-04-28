"use client";
import { useState } from "react";
import CheckBoxField from "../presentation/CheckBoxField";

/**
 * @namespace company-page-form
 * @module company-page-form
 */
/**
 * CheckBoxFieldContainer manages a checkbox field with validation.
 * It toggles the checkbox state and displays an error if necessary.
 *
 * @component
 * @returns {JSX.Element} The rendered CheckBoxFieldContainer component
 */

export default  function CheckBoxFieldContainer({errors, setErrors,isChecked, onChange}) {
  return (
    <div>
      <CheckBoxField onChange={onChange} checked={isChecked}/>
      {setErrors && <p className="text-red-500 text-sm">{errors.terms}</p>}
    </div>
  );

}
