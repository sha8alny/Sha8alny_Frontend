"use client";
import InputFieldContainer from "../../company-page-form/container/InputFieldContainer";
import TagLineContainer from "../../company-page-form/container/TagLineContainer";
import SelectFieldContainer from "../../company-page-form/container/SelectFieldContainer";

/**
 * `EditPage` is a React functional component that provides a form for editing a company's details.
 * It includes input fields for various company information and buttons to save or discard changes.
 * 
 * @namespace company-page-author
 * @module company-page-author
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.companyName - The name of the company.
 * @param {Function} props.setCompanyName - Function to set the company name.
 * @param {string} props.companyIndustry - The industry of the company.
 * @param {Function} props.setCompanyIndustry - Function to set the company industry.
 * @param {string} props.companyTagline - The tagline of the company.
 * @param {Function} props.setCompanyTagline - Function to set the company tagline.
 * @param {string} props.companySize - The size of the company (e.g., small, medium, large).
 * @param {Function} props.setCompanySize - Function to set the company size.
 * @param {string} props.companyType - The type of the company (e.g., private, public).
 * @param {Function} props.setCompanyType - Function to set the company type.
 * @param {string} props.companyLocation - The location of the company.
 * @param {Function} props.setCompanyLocation - Function to set the company location.
 * @param {string} props.companyURL - The URL of the company.
 * @param {Function} props.setCompanyURL - Function to set the company URL.
 * @param {string} props.companyWebsite - The website of the company.
 * @param {Function} props.setCompanyWebsite - Function to set the company website.
 * @param {string} props.companyDate - The founding date of the company.
 * @param {Function} props.setCompanyDate - Function to set the company founding date.
 * @param {string} props.companyPhone - The phone number of the company.
 * @param {Function} props.setCompanyPhone - Function to set the company phone number.
 * @param {string} props.companyDescription - The description of the company.
 * @param {Function} props.setCompanyDescription - Function to set the company description.
 * @param {Function} props.onSave - Function to save the changes.
 * @param {Function} props.onDiscard - Function to discard the changes.
 * @param {boolean} props.loading - A boolean indicating whether the form is in a loading state (e.g., while saving).
 * @param {Object} props.errors - An object containing validation errors for the form fields.
 * @param {Function} props.setErrors - Function to set the form validation errors.
 * 
 * @returns {JSX.Element} - The rendered JSX for the edit page form.
 */

function EditPage({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyTagline, setCompanyTagline, companySize, setCompanySize, companyType, setCompanyType, companyLocation, setCompanyLocation,companyUsername, setCompanyUsername, companyWebsite, setCompanyWebsite, companyDate, setCompanyDate, companyPhone, setCompanyPhone, companyDescription, setCompanyDescription, onSave, onDiscard, loading, errors, setErrors}){
    return(
        <div>
            <div className="p-4 bg-[var(--foreground)] border rounded-lg">
                <InputFieldContainer companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation} companyUsername={companyUsername} setCompanyUsername={setCompanyUsername} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} 
                companyDate={companyDate} setCompanyDate={setCompanyDate} companyPhone={companyPhone} setCompanyPhone={setCompanyPhone} errorss={errors} setErrors={setErrors} isEditing={true}/>
                <SelectFieldContainer companySize={companySize} setCompanySize={setCompanySize} companyType={companyType} setCompanyType={setCompanyType} errorss={errors} setErrors={setErrors} isEditing={true}/>
                <TagLineContainer companyTagline={companyTagline} setCompanyTagline={setCompanyTagline} companyDescription={companyDescription} setCompanyDescription={setCompanyDescription} isEditing={true}/>
                <div className="flex flex-row gap-4">
                    <button className="bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-2 px-3  mt-2" onClick={onDiscard} 
                    disabled={loading}
                    data-testid="discard-button">
                        Discard edits</button>  
                    <button className="bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-2 px-3 mt-2" onClick={onSave} 
                    disabled={loading}
                    data-testid="save-button">  {loading ? "Saving..." : "Save"}</button>            
                </div>
            </div>
        </div>
    );

}

export default EditPage;

