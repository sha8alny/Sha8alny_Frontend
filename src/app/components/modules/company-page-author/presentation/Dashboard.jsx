import { Button } from "@/app/components/ui/Button";

/**
 * @namespace DashboardComponents
 */
/**
 * Dashboard component that displays a welcome message and a button to navigate to the posts page.
 * @component
 * @param {Object} company - The company object containing details of the company.
 * @param {string} company.name - The name of the company.
 * @param {Function} goToPostsPage - Function to navigate the user to the posts page.
 * 
 * @returns {JSX.Element} The rendered Dashboard component.
 */

export default function Dashboard({ company, goToPostsPage }) {
  return (
    <div className="mb-6 rounded-lg bg-[var(--foreground)] p-6 shadow-md">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-text">
            Welcome back, {" "}
            {company?.name}
          </h2>
          <p className="text-zinc-400">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="w-full text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
            onClick={goToPostsPage} data-testid="create-post-button"
          >
            Create Post
          </Button>
        </div>
      </div>
    </div>
  );
}
