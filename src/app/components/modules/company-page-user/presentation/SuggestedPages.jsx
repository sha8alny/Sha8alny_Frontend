import PageSmallCard from "./PageSmallCard";
import Container from "@/app/components/layout/Container";

/**
 * @namespace layout
 * @module layout
 */
/**
 * Renders a container with suggested users.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.users - An array of user objects to be displayed
 * @param {string} props.title - The title to display above the list of users
 * @param {Function} props.onClick - Click handler function for user cards
 * @returns {JSX.Element} A container with a title and a list of user cards
 */
export default function SuggestedPages({ pages, title, onClick, handleFollowClick, followStatus}){
    return (
      <Container className="border border-[#111] flex flex-col gap-2 shadow-xs p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          {title}
        </h2>
        {Array.isArray(pages) && pages.length > 0 ? (
          pages.map((company, index) => (
            <PageSmallCard key={company.username || index} companyInfo={company} onClick={onClick} handleFollowClick={() => handleFollowClick(company.companyUsername)}
            followStatus={followStatus[company.companyUsername]} />
          ))
        ) : (
          <p className="text-gray-500">No suggested pages available.</p>
        )}

      </Container>
    );
  };