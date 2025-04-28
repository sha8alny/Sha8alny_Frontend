import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';
import InputFieldContainer from '../container/InputFieldContainer';
import SelectFieldContainer from "../container/SelectFieldContainer";
import FileUploadContainer from "../container/FileUploadContainer";
import CheckBoxFieldContainer from "../container/CheckBoxFieldContainer";
import TagLineContainer from "../container/TagLineContainer";
import { useState } from "react";


/**
 * @namespace CreateCompany
 */

/**
 * A form component for creating a new company, including fields for company information such as name, industry,
 * location, website, and more. It also includes file upload, checkbox, and description fields.
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.companyName - The name of the company.
 * @param {function} props.setCompanyName - Function to set the company name.
 * @param {string} props.companyIndustry - The industry of the company.
 * @param {function} props.setCompanyIndustry - Function to set the company industry.
 * @param {string} props.companyTagline - The tagline of the company.
 * @param {function} props.setCompanyTagline - Function to set the company tagline.
 * @param {File|null} props.file - The file selected for the company logo or other uploads.
 * @param {function} props.setFile - Function to set the selected file.
 * @param {string} props.companySize - The size of the company.
 * @param {function} props.setCompanySize - Function to set the company size.
 * @param {string} props.companyType - The type of the company.
 * @param {function} props.setCompanyType - Function to set the company type.
 * @param {string} props.companyLocation - The location of the company.
 * @param {function} props.setCompanyLocation - Function to set the company location.
 * @param {string} props.companyWebsite - The website URL of the company.
 * @param {function} props.setCompanyWebsite - Function to set the company website.
 * @param {function} props.onCreateCompany - Function to be called when the form is submitted.
 * @param {string} props.companyUsername - The username for the company.
 * @param {function} props.setCompanyUsername - Function to set the company username.
 * @param {string} props.companyDate - The founding date of the company.
 * @param {function} props.setCompanyDate - Function to set the company founding date.
 * @param {string} props.companyPhone - The phone number for the company.
 * @param {function} props.setCompanyPhone - Function to set the company phone number.
 * @param {boolean} props.loading - Boolean indicating whether the form is in a loading state.
 * @param {boolean} props.isFormValid - Boolean indicating whether the form is valid.
 * @param {Object} props.errors - Object containing validation errors.
 * @param {function} props.setErrors - Function to set the validation errors.
 * @param {boolean} props.isChecked - Whether the terms checkbox is checked.
 * @param {function} props.checkBox - Function to handle checkbox changes.
 * @param {string} [props.error] - Optional error message to display.
 *
 * @returns {JSX.Element} The rendered create company form.
 */

export default function CreateCompanySection({companyName, setCompanyName,companyIndustry, setCompanyIndustry,companyTagline, setCompanyTagline, file, setFile, companySize,setCompanySize, companyType,setCompanyType,companyLocation, setCompanyLocation, companyWebsite, setCompanyWebsite, onCreateCompany, companyUsername, setCompanyUsername, companyDate, setCompanyDate, companyPhone, setCompanyPhone, loading, isFormValid, errors, setErrors, isChecked, checkBox, error})
{
    const [companyDescription, setCompanyDescription] = useState("");
    return (
        <div>
            <p className="flex items-center mb-1 text-sm text-gray-500"><EmergencyRoundedIcon style={{fontSize:"10px"}} className="mr-1"/>indicates required</p>
            <form onSubmit={(e) => { e.preventDefault(); onCreateCompany(); }} className="flex flex-col gap-4 bg-[var(--foreground)] p-4 rounded-lg">
                <InputFieldContainer 
                companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} companyUsername={companyUsername} setCompanyUsername={setCompanyUsername} 
                companyDate={companyDate} setCompanyDate={setCompanyDate} companyPhone={companyPhone} setCompanyPhone={setCompanyPhone} errors={errors} setErrors={setErrors}/> 

                <SelectFieldContainer companySize={companySize} setCompanySize={setCompanySize} companyType={companyType} setCompanyType={setCompanyType} errors={errors} setErrors={setErrors}/>

                <FileUploadContainer file={file} setFile={setFile}/> 
                <TagLineContainer companyTagline={companyTagline} setCompanyTagline={setCompanyTagline} companyDescription={companyDescription} setCompanyDescription={setCompanyDescription} isEditing={false}/>
                <CheckBoxFieldContainer errors={errors} setErrors={setErrors} isChecked={isChecked} onChange={checkBox}/>
                <a href="#" className="hover:underline font-bold text-[var(--secondary)]">Read the Shaغalny Pages Terms </a>   
            </form>
            <div className="flex justify-end">
                {error && <p role="alert" className="text-red-500" data-testid="create-company-error">{error}</p>}
                <button 
                className={`bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-2 px-3  mt-2 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={onCreateCompany} 
                disabled={!isFormValid || loading} 
                data-testid="create-company-button">
                    {loading ? "Creating..." : "Create Page"}
                </button>            
            </div>
        </div>
    );
}