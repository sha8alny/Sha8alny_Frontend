import Container from "@/app/components/layout/Container";
import EditButton from "@/app/components/ui/EditButton";
import { Edit } from "lucide-react";
import ModAbout from "../container/ModAbout";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Renders the About section of a profile
 * @param {Object} props - The component props
 * @param {string} props.about - The about text content to display
 * @param {boolean} props.isMyProfile - Flag indicating if the profile belongs to the current user
 * @returns {JSX.Element} A container with the about section including a heading and text content
 */
export default function About({ about, isMyProfile }) {
  return (
    (about || isMyProfile) && (
    <Container className="dark:border dark:border-[#111] shadow-lg mt-4 p-8">
      <h3 className="justify-between flex text-2xl mb-4 font-bold">
        About
        {isMyProfile && <ModAbout about={about} />}
      </h3>
      <p className="text-muted break-words">{about ?? ""}</p>
      {((!about || about?.length === 0) && isMyProfile) && (
        <div className="w-full border-dashed rounded-2xl border-primary/30 text-muted border-2 p-4 mt-4 flex items-center justify-center">
          <p>
            Add a short description about yourself to let others know more about
            you.{" "}
          </p>
        </div>
      )}
    </Container>
    )
  );
}
