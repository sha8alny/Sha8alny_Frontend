"use client";
import Dialog from "@/app/components/ui/DialogMod";
import ReportPresentation from "../../feed/presentation/ReportPresentation";
import Container from "@/app/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from '@/app/components/ui/Button';
import ClearIcon from '@mui/icons-material/Clear';
import MoreHoriz from '@mui/icons-material/MoreVert';
import { FlagOutlined } from "@mui/icons-material";
import {  DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem, DropdownMenu } from "@/app/components/ui/DropDownMenu";

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
export default function ProfileHeader({ username, isActive, company, handleFollowClick, isFollowing, visitWebsite, OpenCompanyAdminPage, handleDialogConfirm, handleDialogCancel, showUnfollowDialog, isMenuOpen, dropdownRef, setReportUserModalOpen, reportUserModalOpen, reportState, reportText, reportType, setReportText, setReportType, onReport, goToCreateCompany }) {
  return (
    <Container className="shadow-lg">
      <div className="h-max rounded-xl">
        <div className="relative w-full flex">
          <div className="absolute top-0 left-0 w-full h-40 bg-gray-700 rounded-t-xl">
            <Image
              src={ company?.cover || "/placeholder.svg"}
              fill
              alt="Cover Photo"
              className="rounded-t-xl object-cover"
            />
          </div>
          <div className="relative size-44 z-10 ml-6 bg-gray-500 rounded-lg border-8 border-foreground mt-16">
            <Image
              src={ company?.logo || "/placeholder.svg"}
              alt="Logo photo"
              fill
            />
          </div>
        </div>
      </div>
      <div className="py-4 px-8 flex flex-col">
        <div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{company?.name}</h1>
            <p className="text-sm text-text">{company?.tagline}</p>
            <p className="text-muted">{company?.industry} , {company?.location}</p>
          </div>
          <div className="flex flex-row gap-2 items-center mb-3">
            <Button  className={`rounded-full cursor-pointer py-1 px-4 mt-2 transition-all ${isFollowing ? "bg-[var(--foreground)] border border-[var(--secondary)]": "bg-[var(--secondary)]"}`} onClick={handleFollowClick} data-testid="follow-button">
              {isFollowing ? (
                <div className="text-text">
                  <CheckIcon className="mr-1" fontSize="small" />
                  Following
                </div>
              ) : (
                <div>
                  <AddIcon className="mr-1" fontSize="small" />
                  Follow
                </div>
              )}
            </Button>
            <Button className=" bg-[var(--secondary)] rounded-full cursor-pointer py-1 px-4 mt-2 transition-opacity" data-testid="visit-website-button" onClick={visitWebsite}>
              Visit website
            </Button>
            {company?.isOwner && (
              <Button className="bg-[var(--secondary)] rounded-full cursor-pointer py-1 px-4 mt-2 transition-opacity flex-end" onClick={OpenCompanyAdminPage} data-testid="view-as-admin-button">
                <VisibilityIcon className="transition-transform duration-200 group-hover:scale-110" /> View as admin
              </Button>
            )}
            <div className="relative" ref={dropdownRef}>
              {!isMenuOpen && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="cursor-pointer p-2 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <MoreHoriz
                        className="text-muted"
                        sx={{ fontSize: "1rem" }}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    start="right"
                    className="bg-foreground text-primary border"
                  >
                  {!company?.isOwner && 
                    <DropdownMenuItem
                      className="hover:bg-primary/20 cursor-pointer"
                      onClick={() => setReportUserModalOpen(true)}
                    >
                      <FlagOutlined
                        className="mr-2"
                        sx={{ fontSize: "1rem" }}
                      />
                      <span>Report</span>
                    </DropdownMenuItem>
                    }
                    <DropdownMenuItem
                      className="hover:bg-primary/20 cursor-pointer"
                      onClick={goToCreateCompany}
                    >
                      <AddIcon
                        className="mr-2"
                        sx={{ fontSize: "1rem" }}
                      />
                      <span>Create new company</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--text)] flex flex-row space-x-6  cursor-pointer ">
          <Link href={`/company/${username}/user/home`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("home") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`} data-testid="home-page-link">Home</Link>

          <Link href={`/company/${username}/user/about`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("about") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`} data-testid="about-page-link">About</Link>

          <Link href={`/company/${username}/user/posts`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("posts") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`} data-testid="posts-page-link">Posts</Link>
          
          <Link href={`/company/${username}/user/jobs`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("jobs") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`} data-testid="jobs-page-link">Jobs</Link>

          <Link href={`/company/${username}/user/people`} className={`mt-2 px-1 transition-colors duration-200 ${isActive("people") ? "text-[var(--secondary)] font-semibold": "hover:text-opacity-80"}`} data-testid="people-page-link">People</Link>
        </div>
      </div>
      {showUnfollowDialog &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full bg-foreground max-w-md">
          <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Unfollow page</h3>
                <Button className="cursor-pointer" size="icon" variant="ghost" onClick={handleDialogCancel}>
                    <ClearIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-4">
                <p className="text-text">
                  You'll no longer receive notifications from this Page, and you won't see its updates in your feed.
                </p>
              </div>
              <div className="flex flex-row justify-end gap-2">
                  <Button variant="outline" className="rounded-full cursor-pointer" onClick={handleDialogCancel}>
                      Cancel
                  </Button>
                  <Button  className="rounded-full bg-secondary cursor-pointer" onClick={handleDialogConfirm}>
                      Unfollow
                  </Button>
              </div>
          </CardContent>
          </Card>
        </div>
      }
      <Dialog 
        open={reportUserModalOpen}
        onOpenChange={setReportUserModalOpen}
        buttonClass="hidden"
        AlertContent={
        <ReportPresentation
          type="company"
          reportState={reportState}
          reportText={reportText}
          setReportText={setReportText}
          reportType={reportType}
          setReportType={setReportType}
          onReport={onReport}
        />
        }
      />
    </Container>
  );
}
