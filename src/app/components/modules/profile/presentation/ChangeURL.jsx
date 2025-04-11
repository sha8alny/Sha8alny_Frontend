import Container from "@/app/components/layout/Container";
import { Pencil, User } from "lucide-react";
import ModVisibility from "../container/ModVisibility";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A component that displays the user's public profile URL with an edit button.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.username - The username to be displayed in the URL
 * @returns {JSX.Element} A container showing the public profile URL with edit capability
 */
export default function ChangeURL({ userInfo }) {
  return (
    <Container className="dark:border dark:border-[#111] shadow-lg p-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User className="size-5 mr-2 fill-current" />
          Public Profile & URL
        </h2>
        <ModVisibility userInfo={userInfo} />
      </div>
      <p className="text-muted">www.sha8alny.com/u/{userInfo?.username}</p>
    </Container>
  );
}
