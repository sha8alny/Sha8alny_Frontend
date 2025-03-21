"use client";
import { useState } from "react";
import SelectField from "../presentation/SelectField";

/**
 * SelectFieldContainer manages the state for two dropdown fields: Organization Size and Organization Type.
 * It provides the selected values and updates them when the user selects an option.
 *
 * @component
 * @returns {JSX.Element} The rendered SelectFieldContainer component
 */

function SelectFieldContainer({companySize, setCompanySize, companyType, setCompanyType, errors={}}){
    
    return (
        <div>
            <SelectField label="Organization size" name="company-size" options={[
            {label:"0-1 employees", value:"1-option"},
            {label:"2-10 employees", value:"2-option"},{label:"11-50 employees", value:"3-option"},{label:"51-200 employees", value:"4-option"},{label:"201-500 employees", value:"5-option"},{label:"501-1,000 employees", value:"6-option"},{label:"1,001-5,000 employees", value:"7-option"},{label:"5,001-10,000 employees", value:"8-option"},{label:"10,000+ employees", value:"9-option"}]} required optionlabel="size" selectedvalue={companySize} onChange={setCompanySize}/>
            {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}

           <SelectField label="Organization type" name="company-type" options={[
            {label:"Public company", value:"1-option"},{label:"Self-employed", value:"2-option"},{label:"Government agency", value:"3-option"},{label:"Nonprofit", value:"4-option"},
            {label:"Sole proprietorship", value:"5-option"},{label:"Privately held", value:"6-option"},{label:"Partnership", value:"7-option"}]}
            required optionlabel="type" selectedvalue={companyType} onChange={setCompanyType}/>
            {errors.companyType && <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>}
        </div>
    );

}
export default SelectFieldContainer;