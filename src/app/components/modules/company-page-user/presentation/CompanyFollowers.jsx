import Image from "next/image";

/**
 * CompanyFollowers component that displays a company's logo, name, and the number of followers.
 * 
 * @component
 * @example
 * const company = {
 *   logo: "/path/to/logo.svg",
 *   name: "Company Name",
 *   numFollowers: 1200
 * };
 * 
 * return <CompanyFollowers company={company} />;
 * 
 * @param {Object} props - The props for the component.
 * @param {Object} props.company - The company information.
 * @param {string} [props.company.logo] - The URL of the company's logo. Defaults to a placeholder if not provided.
 * @param {string} props.company.name - The name of the company.
 * @param {number} props.company.numFollowers - The number of followers the company has.
 * 
 * @returns {JSX.Element} The rendered JSX element for the company follower information.
 */

export default function CompanyFollowers({ company }) {
    return(
        <div className="flex flex-col justify-center items-center rounded-lg bg-foreground p-4 ">
            <div className="mb-2">
              <Image
                src={company?.logo || "/placeholder.svg"}
                alt="company logo"
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>
            <h2 className="text-text text-xl font-semibold">{company?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{company?.numFollowers} followers</p>
        </div>
    );
}