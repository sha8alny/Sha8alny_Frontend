"use client";
import { useState } from "react";
import InputField from "../presentation/InputField";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

/**
 * @namespace company-page-form
 * @module company-page-form
 */
/**
 * InputFieldContainer manages input fields related to company information.
 * It handles validation for required fields (company name and industry) and updates the state accordingly.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.companyName - The name of the company
 * @param {Function} props.setCompanyName - Function to update the company name state
 * @param {string} props.companyIndustry - The industry of the company
 * @param {Function} props.setCompanyIndustry - Function to update the company industry state
 * @returns {JSX.Element} The rendered InputFieldContainer component
 */

function InputFieldContainer({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyLocation, setCompanyLocation, companyURL, companyWebsite, setCompanyWebsite, setCompanyURL, companyDate, setCompanyDate ,companyPhone,  setCompanyPhone,errors={}, setErrors, isEditing=false}) {
  const [isCompanyURLEdited, setIsCompanyURLEdited ]= useState(false);

  const handleNameError = (e) =>{
    const name = e.target.value;
    if (!isEditing && !isCompanyURLEdited && name !== "") {
      setCompanyURL(name); 
    }
    setCompanyName(name);
    const nameRegex = /^[A-Za-z\s]{2,50}$/; //Allow only letters and spaces, Minimum length:2 , Maximum length:50
    if (name===""){
      setErrors((prev) => ({ ...prev, companyName: (<span className="flex items-center gap-1"><RemoveCircleOutlineIcon style={{fontSize:"16px"}}/> Please enter the Company name</span>)}));
    }
    else if(!nameRegex.test(name)){
      setErrors((prev) => ({ ...prev, companyName: "Only letters are allowed." }));
    } 
    else{
      setErrors((prev) => ({ ...prev, companyName: "" }));
    }
  };

  const handleURlChange=(e)=>{
    const url = e.target.value;
    if (!isCompanyURLEdited && url !== companyName) {
      setIsCompanyURLEdited(true);
    }
    setCompanyURL(url);
    const URLRegex= /^[a-zA-Z0-9-]{3,30}$/;  //Allowed characters are letters, numbers and hyphens 
    if(!URLRegex.test(url) && url !== ""){
      setErrors((prev) => ({ ...prev, companyURL: "Only letters, numbers and hyphens are allowed." }));
    }
    else{
      setErrors((prev) => ({ ...prev, companyURL: "" }));
    }
  };

  const handleIndustryError = (e) =>{
    const industry = e.target.value;
    setCompanyIndustry(industry);
    if (industry==""){
      setErrors((prev) => ({ ...prev, companyIndustry: (<span className="flex items-center gap-1"><RemoveCircleOutlineIcon style={{fontSize:"16px"}}/> Please enter the Company Industry</span>)}));
    }
    else{
      setErrors((prev) => ({ ...prev, companyIndustry: "" }));
    }
  }; 

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setCompanyLocation(location);
    if(location ==""){
      setErrors((prev) => ({ ...prev, companyLocation: (<span className="flex items-center gap-1"><RemoveCircleOutlineIcon style={{fontSize:"16px"}}/> Please enter the Company Location</span>)}));
    }
    else{
      setErrors((prev) => ({ ...prev, companyLocation: "" }));
    }
  };

  const handleWebsiteChange=(e)=>{
    const website= e.target.value;
    setCompanyWebsite(website);
    const websiteRegex = /^(https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/\S*)?$/;
    if(!websiteRegex.test(website)){
      setErrors((prev) => ({ ...prev, companyWebsite: "Please enter a valid website" }));
    }
    else{
      setErrors((prev) => ({ ...prev, companyWebsite: "" }));
    }
  };

  const handleDateChange = (e) => {
    const rawDate = e.target.value; 
    if(rawDate == ""){
      setCompanyDate("");
      setErrors((prev) => ({ ...prev, companyDate: (<span className="flex items-center gap-1"><RemoveCircleOutlineIcon style={{fontSize:"16px"}}/> Please enter the Company Founding Date</span>)}));
      return;
    }
    else{
      setErrors((prev) => ({ ...prev, companyDate: "" }));
    }
    const currentTime = new Date();
    const currentDate = new Date(`${currentTime.getFullYear()}-${String(currentTime.getMonth() +1).padStart(2,"0")}-${String(currentTime.getDate()).padStart(2,"0")}`);
    const selectedDate = new Date(rawDate);
    console.log("currentDate", currentDate);
    console.log("rawDate", selectedDate);
    if(selectedDate> currentDate){
      setErrors((prev) => ({ ...prev, companyDate: "Please enter a valid date" }));
    }
    const dateWithTime = new Date(`${rawDate}T${currentTime.toTimeString().split(" ")[0]}Z`);
    const isoDate = dateWithTime.toISOString(); 
    setCompanyDate(isoDate);
  };

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; 
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const handlePhoneChange = (e) =>{
    setCompanyPhone(e.target.value);
  };

  return (
    <div>
      <InputField label="Name" name="company-name" type="text"  placeholder="Add your organization's name" required selectedname={companyName} maxLength={120} onChange={handleNameError}/>
      {!isEditing && errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}

      <div>
        <InputField label="shaغalny.com/company/"  name="company-url" type="text" placeholder="Add your unique shaغalny address" required selectedname={companyURL} onChange={handleURlChange} />
        <a href="#" className="mt-4 hover:underline font-bold text-[var(--secondary)]">Learn more about the Page Public URL </a>  
        {!isEditing && errors.companyURL && <p className="text-red-500 text-sm mt-1">{errors.companyURL}</p> }
      </div>

      <InputField label="Website" type="text"  name="company-website" placeholder="Begin with http://, https://, www." selectedname={companyWebsite} onChange={handleWebsiteChange}/>

      <InputField label="Location" type="text" name="company-location" placeholder="Add your organization's location" required selectedname={companyLocation} onChange={handleLocationChange}/>
      {!isEditing && errors.companyLocation && <p className="text-red-500 text-sm mt-1">{errors.companyLocation}</p>}

      <InputField label="Industry" type="text" name="company-industry" placeholder="ex:Information Services" required selectedname={companyIndustry} onChange={handleIndustryError}/> 
      {!isEditing && errors.companyIndustry && <p className="text-red-500 text-sm mt-1">{errors.companyIndustry}</p>}

      <InputField label="Founding Date" type="date" name="company-date" placeholder="Select a date" required selectedname={formatDateForInput(companyDate)} onChange={handleDateChange}/>
      {!isEditing && errors.companyDate && <p className="text-red-500 text-sm mt-1">{errors.companyDate}</p>}
      
      <InputField label="Phone Number" type="tel" name="company-number" placeholder="Add your phone number" selectedname={companyPhone} onChange={handlePhoneChange}/>
    </div> 
  );
}

export default InputFieldContainer;