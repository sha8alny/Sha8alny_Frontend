'use client';
import SuggestedUsers from "@/app/components/layout/suggestedusers";
import { useRouter } from "next/navigation";

export default function SuggestedUsersContainer({ title }) {
  // TODO : Fetch data from API
  // TODO : Add choice of fetching (People you may know) or (People also viewed)
  // Currently using static data
  const router = useRouter();
  const navigateToProfile = (username) => {
    router.push(`/u/${username}`);
  };
  const zhf = "/zhfman.jpg";
  const Ezz = "/ease.jpg";
  const PeopleYouMayKnow = [
    {
      name: "Ziad Hesham",
      username: "ziadhesham",
      relation: "2nd",
      job: "Computer Engineering Studentaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      image: zhf,
    },
    {
      name: "Ezz Selim",
      username: "johnsmith",
      relation: "3rd",
      job: "Computer engineering student",
      image: Ezz,
    },
    {
      name: "Alaa ElDin Hamed",
      username: "alaa",
      relation: "3rd+",
      job: "Student at Cairo University",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQGVu0v4o9UJZA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720044887457?e=1747267200&v=beta&t=nxu9Bz-ykucnfzViqFPl4_0b4I15av6oMJbhrhrg_5g",
    },
    {
      name: "Omar Khashan",
      username: "omar",
      relation: "3rd+",
      job: "UG at E-JUST | Top 3% on THM | CTF Player | Digital Forensics Analyst",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQGf0fmYLHNYXQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1682634168413?e=1747872000&v=beta&t=MrpOdpBk_H_dBkO7McUamkzptaVLk_K3RbGZJyUqMEA",
    },
  ];
  return <SuggestedUsers title={title} users={PeopleYouMayKnow} onClick={navigateToProfile} />;
}
