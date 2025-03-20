import Container from "@/components/layout/container";
import { Edit } from "lucide-react";

export default function About({ about }) {
  return (
    <Container className="border border-[#111] shadow-lg mt-4 p-8">
      <h3 className="justify-between flex text-2xl mb-4 font-bold">
        About
        <button className="p-1 hover:bg-gray-500 rounded-md">
          <Edit />
        </button>
      </h3>
      <p className="text-muted">{about}</p>
    </Container>
  );
}
