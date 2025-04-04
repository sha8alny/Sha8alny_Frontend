/**
 * @namespace company-page-author
 * @module company-page-author
 */
"use client";

import EditInputFieldContainer from "../container/EditInputFieldContainer";
import EditSelectFieldContainer from "../container/EditSelectFieldContainer";
import TagLineContainer from "../../company-page-form/container/TagLineContainer";

function EditPage({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyTagline, setCompanyTagline, companySize, setCompanySize, companyType, setCompanyType, companyLocation, setCompanyLocation,companyURL, setCompanyURL, companyWebsite, setCompanyWebsite, onSave, onDiscard, loading, errors, setErrors}){
    return(
        <div className="flex flex-row">
            <div className="w-full p-4 pr-6 space-y-2 border border-[var(--secondary)] mt-5 rounded-lg mx-4">
                <EditInputFieldContainer companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation} companyURL={companyURL} setCompanyURL={setCompanyURL} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} errorss={errors} setErrors={setErrors}/>
                <EditSelectFieldContainer companySize={companySize} setCompanySize={setCompanySize} companyType={companyType} setCompanyType={setCompanyType}/>
                <TagLineContainer companyTagline={companyTagline} setCompanyTagline={setCompanyTagline}/>
                <div className="flex flex-row gap-4">
                    <button className="bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-2 px-3  mt-2" onClick={onDiscard} disabled={loading}> Discard edits</button>  
                    <button className="bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-2 px-3 mt-2" onClick={onSave} disabled={loading}>{loading ? "Saving..." : "Save"}</button>            
                </div>
            </div>
        </div>
    );

}

export default EditPage;

