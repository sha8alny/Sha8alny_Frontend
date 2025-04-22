/**
 * @namespace company-page-author
 * @module company-page-author
 */
"use client";

import InputFieldContainer from "../../company-page-form/container/InputFieldContainer";
import TagLineContainer from "../../company-page-form/container/TagLineContainer";
import SelectFieldContainer from "../../company-page-form/container/SelectFieldContainer";

function EditPage({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyTagline, setCompanyTagline, companySize, setCompanySize, companyType, setCompanyType, companyLocation, setCompanyLocation,companyURL, setCompanyURL, companyWebsite, setCompanyWebsite, companyDate, setCompanyDate, companyPhone, setCompanyPhone, companyDescription, setCompanyDescription, onSave, onDiscard, loading, errors, setErrors}){
    return(
        <div>
            <div className="p-4 bg-[var(--foreground)] border rounded-lg">
                <InputFieldContainer companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation} companyURL={companyURL} setCompanyURL={setCompanyURL} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} 
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

