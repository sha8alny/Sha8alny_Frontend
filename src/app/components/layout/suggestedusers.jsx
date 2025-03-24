import { Users } from "lucide-react";
import UserSmallCard from "./usersmallcard";
import Container from "./Container";


export default function SuggestedUsers({ users, title, onClick }){
    return (
      <Container className="border border-[#111] flex flex-col gap-2 shadow-xs p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="size-5 mr-2 fill-current" />
          {title}
        </h2>
        {users.map((user, index) => (
          <UserSmallCard key={index} userInfo={user} onClick={onClick} />
        ))}
      </Container>
    );
  };