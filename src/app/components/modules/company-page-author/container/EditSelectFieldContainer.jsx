import SelectField from "../../company-page-form/presentation/SelectField"

/**
 * @namespace company-page-author
 * @module company-page-author
 */
/**
 * EditSelectFieldContainer component handles select dropdowns for company size and type.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.companySize - The selected company size option.
 * @param {Function} props.setCompanySize - Function to update the selected company size.
 * @param {string} props.companyType - The selected company type option.
 * @param {Function} props.setCompanyType - Function to update the selected company type.
 * @returns {JSX.Element} The EditSelectFieldContainer component.
 */

function EditSelectFieldContainer({companySize, setCompanySize, companyType, setCompanyType}){
    return(
        <div>
            <SelectField label="Organization size" name="company-size" options={[
            {label:"0-1 employees", value:"1-option"},
            {label:"2-10 employees", value:"2-option"},{label:"11-50 employees", value:"3-option"},{label:"51-200 employees", value:"4-option"},{label:"201-500 employees", value:"5-option"},{label:"501-1,000 employees", value:"6-option"},{label:"1,001-5,000 employees", value:"7-option"},{label:"5,001-10,000 employees", value:"8-option"},{label:"10,000+ employees", value:"9-option"}]} required optionlabel="size" selectedvalue={companySize} onChange={setCompanySize}/>


           <SelectField label="Organization type" name="company-type" options={[
            {label:"Public company", value:"1-option"},{label:"Self-employed", value:"2-option"},{label:"Government agency", value:"3-option"},{label:"Nonprofit", value:"4-option"},
            {label:"Sole proprietorship", value:"5-option"},{label:"Privately held", value:"6-option"},{label:"Partnership", value:"7-option"}]}
            required optionlabel="type" selectedvalue={companyType} onChange={setCompanyType}/>
        </div>

    );

}
export default EditSelectFieldContainer