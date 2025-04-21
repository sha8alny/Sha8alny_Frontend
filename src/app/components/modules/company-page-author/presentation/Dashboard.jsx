import { Button } from "@/app/components/ui/Button";

/**
 * `Dashboard` is a React functional component that displays a welcome message for the user,
 * along with a button to navigate to the posts page.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.company - The company object containing information about the company.
 * @param {string} props.company.name - The name of the company.
 * @param {Function} props.goToPostsPage - A function that navigates the user to the posts page when called.
 * 
 * @returns {JSX.Element} - The rendered JSX for the dashboard view.
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
