'use client';
import SuggestedPages from "../presentation/SuggestedPages";
import { useRouter } from "next/navigation";
/**
 * @namespace profile
 * @module profile
 */

export default function SuggestedPagesContainer({ title }) {
  // TODO : Fetch data from API
  // TODO : Add choice of fetching (People you may know) or (People also viewed)
  // Currently using static data
  const router = useRouter();
  const navigateToProfile = (username) => {
    router.push(`/company-user-admin/${username}/post-page`);
  };
  const zhf = "/zhfman.jpg";
  const Ezz = "/ease.jpg";
  const AffiliatedPages = [
    {
      name: "Enlighted",
      username: "Enlighted",
      job: "IT Services and IT Consulting",
      image: "https://media.licdn.com/dms/image/v2/D4E0BAQEKWdvIoanA9w/company-logo_200_200/company-logo_200_200/0/1688584065186/enlighted_inc_logo?e=1749686400&v=beta&t=hQ5R4z-wEc3mxaJFoILMeGaL_EcRX78zAAr_z1HF9WA",
    },
    {
      name: "Siemens",
      username: "Siemens",
      job: "Electric Power Transmission, Control, and Distribution",
      image: "https://media.licdn.com/dms/image/v2/D4D0BAQFK_4wGnzwPTQ/company-logo_200_200/company-logo_200_200/0/1719931174735/siemens_logo?e=1749686400&v=beta&t=sXDC2IVC6iLVwgXYLeQWe9kOkqAuhW7x3AzlBDM6N5w",
    },
    {
      name: "Schneider Electric",
      username: "Schneider Electric",
      job: "Automation Machinery Manufacturing",
      image: "https://media.licdn.com/dms/image/v2/C4E0BAQGNfeTPCu6Z-w/company-logo_200_200/company-logo_200_200/0/1631312208065?e=1749686400&v=beta&t=svEWAUdr08fcyQvg5TrDJ3LHZTSeR4WgmQtNHKOGrFc",
    },
    {
      name: "ABB",
      username: "ABB",
      job: "Automation Machinery Manufacturing",
      image: "https://media.licdn.com/dms/image/v2/C4D0BAQHPGAMgqJMBZQ/company-logo_200_200/company-logo_200_200/0/1630579606103/abb_logo?e=1749686400&v=beta&t=JEOGRMDQVh5qE5thGEwB55ssDJaPGJVn7H-2BFlShI8",
    },
  ];
  return <SuggestedPages title={title} pages={AffiliatedPages} onClick={navigateToProfile} />;
}
