import Image from "next/image";

/**
 * @namespace CompanyProfile
 * @description Namespace for components and types related to the company profile section.
 */

/**
 * CompanyFollowers component - Displays the company logo, name, and follower count.
 *
 * @memberof CompanyProfile
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.company - The company object containing the logo, name, and number of followers.
 * @param {string} [props.company.logo] - The URL of the company logo. Defaults to a placeholder if not provided.
 * @param {string} [props.company.name] - The name of the company.
 * @param {number} [props.company.numFollowers] - The number of followers the company has.
 *
 * @returns {JSX.Element} A rendered component displaying the company logo, name, and follower count.
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