/**
 * @namespace company-page-form
 * @module company-page-form
 */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

function CompanyPreviewSection({companyName, companyTagline, companyIndustry, preview}){
    return (
        <div>
            <div className="text-text bg-[var(--foreground)] p-2 rounded-t-lg">
            <p className="flex items-center gap-2">Page preview <HelpOutlineIcon/></p>
            </div>
            <div className="bg-[var(--background)] border border-gray-600 rounded-b-lg">
                <div className="bg-[var(--foreground)] p-5 m-5 rounded-lg">
                    <div className="w-24 h-24 bg-[var(--background)] flex items-center justify-center rounded">
                        {preview ? ( <img src={preview} alt="Company Logo" className="w-full h-full object-cover"/>) : ( <ImageOutlinedIcon fontSize="large"/>)}
                    </div>
                    <p className="text-text break-all text-[24px] mt-2">{companyName || "Company name"}</p>
                    <p className="text-text mt-1 break-all">{companyTagline|| "Tagline"}</p>
                    <p className="text-gray-400 mt-1">{companyIndustry || "Industry"}</p>
                    <button className="flex items-center gap-1 bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer mt-3 py-[6px] px-4"><AddIcon/> Follow</button>
                </div>
            </div>
        </div>

    );
}

export default CompanyPreviewSection;