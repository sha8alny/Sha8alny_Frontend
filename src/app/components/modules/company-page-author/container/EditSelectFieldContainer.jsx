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
            {label:"0-1 employees", value:"0-1 employees"},
            {label:"2-10 employees", value:"2-10 employees"},
            {label:"11-50 employees", value:"11-50 employees"},
            {label:"51-200 employees", value:"51-200 employees"},
            {label:"201-500 employees", value:"201-500 employees"},
            {label:"501-1,000 employees", value:"501-1,000 employees"},
            {label:"1,001-5,000 employees", value:"1,001-5,000 employees"},
            {label:"5,001-10,000 employees", value:"5,001-10,000 employees"},
            {label:"10,000+ employees", value:"10,000+ employees"}]}
             required optionlabel="size" selectedvalue={companySize} onChange={setCompanySize}/>


           <SelectField label="Organization type" name="company-type" options={[
            {label:"Public company", value:"Public company"},
            {label:"Self employed", value:"Self employed"},
            {label:"Government agency", value:"Government agency"},
            {label:"Nonprofit", value:"Nonprofit"},
            {label:"Sole proprietorship", value:"Sole proprietorship"},
            {label:"Privately held", value:"Privately held"},
            {label:"Partnership", value:"Partnership"}]}
            required optionlabel="type" selectedvalue={companyType} onChange={setCompanyType}/>
        </div>

    );

}
export default EditSelectFieldContainer