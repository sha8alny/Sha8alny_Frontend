import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';
import InputFieldContainer from '../container/InputFieldContainer';
import SelectFieldContainer from "../container/SelectFieldContainer";
import FileUploadContainer from "../container/FileUploadContainer";
import CheckBoxFieldContainer from "../container/CheckBoxFieldContainer";
import TagLineContainer from "../container/TagLineContainer";

function CreateCompanySection({companyName, setCompanyName,companyIndustry, setCompanyIndustry,companyTagline, setCompanyTagline, file, setFile, companySize,setCompanySize, companyType,setCompanyType,companyLocation, setCompanyLocation, companyWebsite, setCompanyWebsite, onCreateCompany, companyURL, setCompanyURL, loading, isFormValid, errors, setErrors})
{
    return (
        <div>
            <p className="flex items-center mb-1 text-sm text-gray-500"><EmergencyRoundedIcon style={{fontSize:"10px"}} className="mr-1"/>indicates required</p>
            <form onSubmit={(e) => { e.preventDefault(); onCreateCompany(); }} className="flex flex-col gap-4 bg-[var(--foreground)] p-4 rounded-lg">
                <InputFieldContainer 
                companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} companyURL={companyURL} setCompanyURL={setCompanyURL} errors={errors} setErrors={setErrors}/> 

                <SelectFieldContainer companySize={companySize} setCompanySize={setCompanySize} companyType={companyType} setCompanyType={setCompanyType} errors={errors} setErrors={setErrors}/>

                <FileUploadContainer file={file} setFile={setFile}/> 
                <TagLineContainer companyTagline={companyTagline} setCompanyTagline={setCompanyTagline}/>
                <CheckBoxFieldContainer errors={errors} setErrors={setErrors}/>
                <a href="#" className="hover:underline font-bold text-[var(--secondary)]">Read the Shaغalny Pages Terms </a>   
            </form>
            <div className="flex justify-end">
                <button className={`bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-2 px-3  mt-2 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={onCreateCompany} disabled={!isFormValid || loading}>
                {loading ? "Creating..." : "Create Page"}</button>            
            </div>
        </div>
    );
}
export default CreateCompanySection;