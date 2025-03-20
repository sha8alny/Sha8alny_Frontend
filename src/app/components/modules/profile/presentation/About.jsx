import Container from "@/components/layout/Container";
import EditButton from "@/components/ui/EditButton";
import { Edit } from "lucide-react";

export default function About({ about }) {
  return (
    <Container className="border border-[#111] shadow-lg mt-4 p-8">
      <h3 className="justify-between flex text-2xl mb-4 font-bold">
        About
        <EditButton/>
      </h3>
      <p className="text-muted">{about}</p>
    </Container>
  );
}
