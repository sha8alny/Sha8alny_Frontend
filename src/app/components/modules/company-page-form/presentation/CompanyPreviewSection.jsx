import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

/**
 * @namespace PreviewComponents
 */

/**
 * A component that displays a preview of a company's page, including the company's logo, name, tagline, and industry.
 * The component conditionally renders the company logo if available or an icon if not, along with the company name,
 * tagline, and industry. It also includes a follow button.
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.companyName - The name of the company to display.
 * @param {string} props.companyTagline - The tagline of the company to display.
 * @param {string} props.companyIndustry - The industry the company belongs to.
 * @param {string} [props.preview] - The URL of the company logo. If not provided, an icon will be displayed instead.
 * 
 * @returns {JSX.Element} The rendered company preview section.
 */

export default function CompanyPreviewSection({companyName, companyTagline, companyIndustry, preview}){
    return (
        <div>
            <div className="text-text bg-[var(--foreground)] p-2 rounded-t-lg">
            <p className="flex items-center gap-2">Page preview <HelpOutlineIcon/></p>
            </div>
            <div className="bg-[var(--background)] border border-gray-600 rounded-b-lg">
                <div className="bg-[var(--foreground)] p-5 m-5 rounded-lg">
                    <div className="w-24 h-24 bg-[var(--background)] flex items-center justify-center rounded">
                        {preview ? ( <img src={preview } alt="Company Logo" className="w-full h-full object-cover"/>) : ( <ImageOutlinedIcon fontSize="large"/>)}
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