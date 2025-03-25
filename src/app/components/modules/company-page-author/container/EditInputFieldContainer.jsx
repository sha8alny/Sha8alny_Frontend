import InputField from "../../company-page-form/presentation/InputField";
function EditInputFieldContainer({companyName,setCompanyName, companyIndustry,setCompanyIndustry, companyLocation, setCompanyLocation, companyURL,setCompanyURL, companyWebsite, setCompanyWebsite,errors={}, setErrors}){
    const handleNameError = (e) =>{
        const name = e.target.value.trim();
        setCompanyName(name);
        const nameRegex = /^[A-Za-z\s]{2,50}$/; 
        if(!nameRegex.test(name)){
          setErrors((prev) => ({ ...prev, companyName: "Only letters are allowed." }));
        } 
        else{
          setErrors((prev) => ({ ...prev, companyName: "" }));
        }
    };
    const handleURlChange=(e)=>{
        const url = e.target.value.trim();
        setCompanyURL(url);
        const URLRegex= /^[a-zA-Z0-9-]{3,}$/;
        if(!URLRegex.test(url)){
            setErrors((prev) => ({ ...prev, companyURL: "Only letters, numbers and hyphens are allowed." }));
        }
        else{
            setErrors((prev) => ({ ...prev, companyURL: "" }));
        }
    };
    const handleIndustryError = (e) =>{
        const industry = e.target.value;
        setCompanyIndustry(industry);
    }; 

    const handleLocationChange = (e) => {
        const location = e.target.value;
        setCompanyLocation(location);
    };

    const handleWebsiteChange=(e)=>{
        const website= e.target.value.trim();
        setCompanyWebsite(website);
        const websiteRegex = /^(https?:\/\/ |http:\/\/ |www\.)[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/\S*)?$/;
        if(!websiteRegex.test(website)){
            setErrors((prev) => ({ ...prev, companyWebsite: "Please enter a valid website" }));
        }
        else{
            setErrors((prev) => ({ ...prev, companyWebsite: "" }));
        }
    };

    return(
        <div>
            <InputField label="Name" name="company-name" placeholder="Add your organization's name" maxLength={120} required selectedname={companyName} onChange={handleNameError}/>

            <div>
                <InputField label="shaغalny.com/company/" name="company-url" placeholder="Add your unique shaغalny address" required selectedname={companyURL} onChange={handleURlChange} />
                <a href="#" className="mt-4 hover:underline font-bold text-[var(--secondary)]">Learn more about the Page Public URL </a>  
            </div>

            <InputField label="Website" name="company-website" placeholder="Begin with http://, https://, www." selectedname={companyWebsite} onChange={handleWebsiteChange}/>

            <InputField label="Location" name="company-location" placeholder="Add your organization's location" required selectedname={companyLocation} onChange={handleLocationChange}/>

            <InputField label="Industry" name="company-industry" placeholder="ex:Information Services" required selectedname={companyIndustry} onChange={handleIndustryError}/> 
        </div> 
    );

}
export default EditInputFieldContainer;