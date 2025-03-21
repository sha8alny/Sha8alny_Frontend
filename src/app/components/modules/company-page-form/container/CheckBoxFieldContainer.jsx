"use client";
import { useState } from "react";
import CheckBoxField from "../presentation/CheckBoxField";

/**
 * CheckBoxFieldContainer manages a checkbox field with validation.
 * It toggles the checkbox state and displays an error if necessary.
 *
 * @component
 * @returns {JSX.Element} The rendered CheckBoxFieldContainer component
 */


function CheckBoxFieldContainer({errors, setErrors}) {
    const [isChecked, setIsChecked] = useState(false);
    const [showerror, setShowError] = useState(false);
    const checkBox =()=>{
      if (isChecked){
        setShowError(true);
      }
      else{
        setShowError(false);
      }
      setIsChecked(!isChecked);
      setErrors((prevErrors) => ({
        ...prevErrors,
        terms: !isChecked ? "" : "You must agree to the terms.",}));
    };
    return (
      <div>
         <CheckBoxField onChange={checkBox} checked={isChecked} showerror={showerror}/>
         {setErrors && <p className="text-red-500 text-sm">{errors.terms}</p>}
      </div>
    );

    
}
export default CheckBoxFieldContainer;
