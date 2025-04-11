"use client";
import Container from "@/app/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

/**
 * @namespace profile
 * @module profile
 */

/**
 * Renders the header section of a company's profile page.
 *
 * Displays the company's cover photo, logo, name, industry, location,
 * follow and website buttons, and navigation links to different sections.
 *
 * @function ProfileHeader
 * @param {Object} props - Component props
 * @param {Object} props.userProfile - Profile identifier (usually a string ID or name slug)
 * @param {Function} props.isActive - Function to determine the active navigation tab
 * @param {Object} props.company - Company information
 * @param {string} [props.company.cover] - URL of the company's cover photo
 * @param {string} [props.company.logo] - URL of the company's logo
 * @param {string} [props.company.industry] - Industry the company operates in
 * @param {string} [props.company.location] - Company location
 * @returns {JSX.Element} Profile header component with company branding and navigation
 */
export default function ProfileHeader({ userProfile, isActive, company, handleFollowClick, isFollowing }) {
  return (
    <Container className="border-[#111] border shadow-lg">
      <div className="h-max rounded-xl">
        <div className="relative w-full flex">
          <div className="absolute top-0 left-0 w-full h-40 bg-gray-700 rounded-t-xl">
            <Image
              src={
                company?.cover ??
                "https://picsum.photos/id/11/600/400"
              }
              fill
              alt="Cover Photo"
              className="rounded-t-xl object-cover"
            />
          </div>
          <div className="relative size-44 z-10 ml-6 bg-gray-500 rounded-lg border-8 border-foreground mt-16">
            <Image
              src={
                company?.logo??
                "https://picsum.photos/id/11/600/400"
              }
              alt="User Avatar"
              fill
            />
          </div>
        </div>
      </div>
      <div className="py-4 px-8 flex flex-col">
        <div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{userProfile}</h1>
            <p className="text-muted">{company?.industry} , {company?.location}</p>
          </div>
          <div className="flex flex-row gap-2 items-center mb-3">
            <button className={`rounded-full cursor-pointer py-1 px-4 mt-2 transition-all ${isFollowing ? "bg-[var(--foreground)] border border-[var(--secondary)] text-[var(--text)]" : "bg-[var(--secondary)] text-[var(--text)]"}`} onClick={handleFollowClick}>
              {isFollowing ? (
                <div>
                  <CheckIcon className="mr-1" fontSize="small" />
                  Following
                </div>
              ) : (
                <div>
                  <AddIcon className="mr-1" fontSize="small" />
                  Follow
                </div>
              )}
            </button>
            <button className="bg-[var(--secondary)] rounded-full cursor-pointer py-1 px-4 mt-2 transition-opacity">
              Visit website
            </button>
          </div>
        </div>
        <div className="border-t border-[var(--text)] flex flex-row space-x-6  cursor-pointer ">
          <Link href={`/company-user-admin/${userProfile}/home-page`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("home-page") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`}>Home</Link>

          <Link href={`/company-user-admin/${userProfile}/about-page`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("about-page") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`}>About</Link>

          <Link href={`/company-user-admin/${userProfile}/jobs-page`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("jobs-page") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`}>Jobs</Link>

          <Link href={`/company-user-admin/${userProfile}/posts-page`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("posts-page") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`}>Posts</Link>

          <Link href={`/company-user-admin/${userProfile}/life-page`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("life-page") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`}>Life</Link>

          <Link href={`/company-user-admin/${userProfile}/people-page`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("people-page") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`}>People</Link>
        </div>
      </div>
    </Container>
  );
}
