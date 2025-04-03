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

function InputFieldContainer({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyLocation, setCompanyLocation, companyURL, companyWebsite, setCompanyWebsite, setCompanyURL,errors={}, setErrors}) {
  const [isCompanyURLEdited, setIsCompanyURLEdited ]= useState(false);

  const handleNameError = (e) =>{
    const name = e.target.value;
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
    if(!isCompanyURLEdited){
      setCompanyURL(name);
    }
  };

  const handleURlChange=(e)=>{
    const url = e.target.value;
    setCompanyURL(url);
    setIsCompanyURLEdited(true);
    const URLRegex= /^[a-zA-Z0-9-]{3,}$/;  //Allowed characters are letters, numbers and hyphens 
    if(!URLRegex.test(url)){
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
      console.log("Setting industry error"); 
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

  return (
    <div>
      <InputField label="Name" name="company-name" placeholder="Add your organization's name" maxLength={120} required selectedname={companyName} onChange={handleNameError}/>
      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}

      <div>
        <InputField label="shaغalny.com/company/" name="company-url" placeholder="Add your unique shaغalny address" required selectedname={companyURL || companyName} onChange={handleURlChange} />
        <a href="#" className="mt-4 hover:underline font-bold text-[var(--secondary)]">Learn more about the Page Public URL </a>  
        {setErrors && <p className="text-red-500 text-sm mt-1">{errors.companyURL}</p> }
      </div>

      <InputField label="Website" name="company-website" placeholder="Begin with http://, https://, www." selectedname={companyWebsite} onChange={handleWebsiteChange}/>

      <InputField label="Location" name="company-location" placeholder="Add your organization's location" required selectedname={companyLocation} onChange={handleLocationChange}/>
      {setErrors && <p className="text-red-500 text-sm mt-1">{errors.companyLocation}</p>}

      <InputField label="Industry" name="company-industry" placeholder="ex:Information Services" required selectedname={companyIndustry} onChange={handleIndustryError}/> 
      {setErrors && <p className="text-red-500 text-sm mt-1">{errors.companyIndustry}</p>}
    </div> 
  );
}

export default InputFieldContainer;