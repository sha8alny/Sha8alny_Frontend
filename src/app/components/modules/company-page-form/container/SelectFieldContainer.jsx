"use client";
import { useState } from "react";
import SelectField from "../presentation/SelectField";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

/**
 * @namespace company-page-form
 * @module company-page-form
 */
/**
 * SelectFieldContainer manages the state for two dropdown fields: Organization Size and Organization Type.
 * It provides the selected values and updates them when the user selects an option.
 *
 * @component
 * @returns {JSX.Element} The rendered SelectFieldContainer component
 */

function SelectFieldContainer({companySize, setCompanySize, companyType, setCompanyType, errors={}, setErrors,isEditing=false}){
    const handleCompanySizeChange = (e) => {
        const selectedSize = e.target.value;
        setCompanySize(selectedSize);
        if (selectedSize == "") {
            setErrors((prev) => ({ ...prev, companySize: (<span className="flex items-center gap-1"><RemoveCircleOutlineIcon style={{fontSize:"16px"}}/> Please enter the Company Size</span>)}));
        } else {
            setErrors((prev) => ({ ...prev, companySize: "" }));
        }
    }
    const handleCompanyTypeChange = (e) => { 
        const selectedType = e.target.value;
        setCompanyType(selectedType);
        if (selectedType == "") {
            setErrors((prev) => ({ ...prev, companyType: (<span className="flex items-center gap-1"><RemoveCircleOutlineIcon style={{fontSize:"16px"}}/> Please enter the Company Type</span>)}));
        } else {
            setErrors((prev) => ({ ...prev, companySize: "" }));
        }
    }   
    return (
        <div>
            <SelectField label="Organization size" name="company-size" options={[
            {label:"0-1 employees", value:"0-1 employees"},
            {label:"2-10 employees", value:"2-10 employees"},
            {label:"11-50 employees", value:"11-50 employees"},
            {label:"51-200 employees", value:"51-200 employees"},
            {label:"201-500 employees", value:"201-500 employees"},
            {label:"501-1,000 employees", value:"501-1,000 employees"},
            {label:"1,001-5,000 employees", value:"1,001-5,000 employees"},
            {label:"5,001-10,000 employees", value:"5,001-10,000 employees"},
            {label:"10,000+ employees", value:"10,000+ employees"}]} 
            required 
            optionlabel="size" 
            selectedvalue={companySize} onChange={handleCompanySizeChange}/>
            {!isEditing && errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}

           <SelectField label="Organization type" name="company-type" options={[
            {label:"Public company", value:"Public company"},
            {label:"Self employed", value:"Self employed"},
            {label:"Government agency", value:"Government agency"},
            {label:"Nonprofit", value:"Nonprofit"},
            {label:"Sole proprietorship", value:"Sole proprietorship"},
            {label:"Privately held", value:"Privately held"},
            {label:"Partnership", value:"Partnership"}]}
            required 
            optionlabel="type" 
            selectedvalue={companyType} onChange={handleCompanyTypeChange}/>
            {!isEditing && errors.companyType && <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>}
        </div>
    );

}
export default SelectFieldContainer;