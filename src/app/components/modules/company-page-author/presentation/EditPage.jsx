import InputFieldContainer from "../../company-page-form/container/InputFieldContainer";
import TagLineContainer from "../../company-page-form/container/TagLineContainer";
import SelectFieldContainer from "../../company-page-form/container/SelectFieldContainer";

/**
 * @namespace EditPageComponents
 */
/**
 * EditPage component for editing company details.
 * @param {string} companyName - The name of the company.
 * @param {Function} setCompanyName - Function to update company name state.
 * @param {string} companyIndustry - The industry of the company.
 * @param {Function} setCompanyIndustry - Function to update company industry state.
 * @param {string} companyTagline - The tagline of the company.
 * @param {Function} setCompanyTagline - Function to update company tagline state.
 * @param {string} companySize - The size of the company.
 * @param {Function} setCompanySize - Function to update company size state.
 * @param {string} companyType - The type of the company.
 * @param {Function} setCompanyType - Function to update company type state.
 * @param {string} companyLocation - The location of the company.
 * @param {Function} setCompanyLocation - Function to update company location state.
 * @param {string} companyUsername - The username of the company.
 * @param {Function} setCompanyUsername - Function to update company username state.
 * @param {string} companyWebsite - The website of the company.
 * @param {Function} setCompanyWebsite - Function to update company website state.
 * @param {string} companyDate - The date associated with the company (e.g., founded date).
 * @param {Function} setCompanyDate - Function to update company date state.
 * @param {string} companyPhone - The phone number of the company.
 * @param {Function} setCompanyPhone - Function to update company phone state.
 * @param {string} companyDescription - The description of the company.
 * @param {Function} setCompanyDescription - Function to update company description state.
 * @param {Function} onSave - Function to handle saving the edited company details.
 * @param {Function} onDiscard - Function to handle discarding the changes.
 * @param {boolean} loading - A boolean indicating if the save action is in progress.
 * @param {object} errors - An object containing any validation errors.
 * @param {Function} setErrors - Function to update the errors object.
 * 
 * @returns {JSX.Element} The rendered EditPage component.
 */

export default function EditPage({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyTagline, setCompanyTagline, companySize, setCompanySize, companyType, setCompanyType, companyLocation, setCompanyLocation,companyUsername, setCompanyUsername, companyWebsite, setCompanyWebsite, companyDate, setCompanyDate, companyPhone, setCompanyPhone, companyDescription, setCompanyDescription, onSave, onDiscard, loading, errors, setErrors}){
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