"use client";

import InputFieldContainer from "../../company-page-form/container/InputFieldContainer";
import SelectFieldContainer from "../../company-page-form/container/SelectFieldContainer";
import TagLineContainer from "../../company-page-form/container/TagLineContainer";

function EditPage({companyName, setCompanyName, companyIndustry, setCompanyIndustry, companyTagline, setCompanyTagline, companySize, setCompanySize, companyType, setCompanyType, companyLocation, setCompanyLocation,companyURL, setCompanyURL, onSave, onDiscard, loading}){
    return(
        <div className="flex flex-row">
            <div className="w-full p-4 pr-6 space-y-2 border border-[var(--secondary)] mt-5 rounded-lg mx-4">
                <InputFieldContainer companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation} companyURL={companyURL} setCompanyURL={setCompanyURL}/>
                <SelectFieldContainer companySize={companySize} setCompanySize={setCompanySize} companyType={companyType} setCompanyType={setCompanyType}/>
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

