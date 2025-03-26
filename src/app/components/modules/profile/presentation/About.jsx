import Container from "@/app/components/layout/Container";
import EditButton from "@/app/components/ui/EditButton";
import { Edit } from "lucide-react";
import ModAbout from "../container/ModAbout";

/**
 * Renders the About section of a profile
 * @param {Object} props - The component props
 * @param {string} props.about - The about text content to display
 * @param {boolean} props.isMyProfile - Flag indicating if the profile belongs to the current user
 * @returns {JSX.Element} A container with the about section including a heading and text content
 */
export default function About({ about, isMyProfile }) {
  return (
    <Container className="border border-[#111] shadow-lg mt-4 p-8">
      <h3 className="justify-between flex text-2xl mb-4 font-bold">
        About
        {isMyProfile && <ModAbout about={about}/>}
      </h3>
      <p className="text-muted">{about}</p>
    </Container>
  );
}
