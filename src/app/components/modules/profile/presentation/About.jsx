import Container from "@/app/components/layout/Container";
import EditButton from "@/app/components/ui/EditButton";
import { Edit } from "lucide-react";
import ModAbout from "../container/ModAbout";

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
