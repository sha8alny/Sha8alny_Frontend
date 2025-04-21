import { useInfiniteQuery } from "@tanstack/react-query";
import Dialog from "@/app/components/ui/DialogMod";
import { fetchUserConnections } from "@/app/services/userProfile";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import ConnectionsPresentation from "../presentation/ConnectionsPresentation";

export default function Connections({ userInfo }) {
  const observerTarget = useRef(null);
  const router = useRouter();
  const { isMyProfile } = useIsMyProfile();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["connections", userInfo?.username],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserConnections(
        pageParam,
        10,
        userInfo?._id !== undefined ? userInfo._id : null // Will change once backend modifies the endpoint
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.length || lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const navigateTo = (username) => {
    router.push(`/u/${username}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const connections = data?.pages.flatMap((page) => page) || [];

  const mockData = [
    {
      name: "John Doe",
      headline: "Software Engineer",
      _id: "1",
      connectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Jane Smith",
      headline: "Product Manager",
      _id: "2",
      connectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Alice Johnson",
      headline: "UX Designer",
      _id: "3",
      connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Bob Brown",
      headline: "Data Scientist",
      _id: "4",
      connectedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Charlie Davis",
      headline: "DevOps Engineer",
      _id: "5",
      connectedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Eve Wilson",
      headline: "Marketing Specialist",
      _id: "6",
      connectedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Frank Miller",
      headline: "Sales Executive",
      _id: "7",
      connectedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Grace Lee",
      headline: "HR Manager",
      _id: "8",
      connectedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Hank Green",
      headline: "Content Writer",
      _id: "9",
      connectedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Ivy Adams",
      headline: "Graphic Designer",
      _id: "10",
      connectedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Jack White",
      headline: "Web Developer",
      _id: "11",
      connectedAt: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Kathy Black",
      headline: "SEO Expert",
      _id: "12",
      connectedAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Leo King",
      headline: "Network Administrator",
      _id: "13",
      connectedAt: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Mia Scott",
      headline: "Business Analyst",
      _id: "14",
      connectedAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Nina Young",
      headline: "Project Coordinator",
      _id: "15",
      connectedAt: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Oscar King",
      headline: "Financial Analyst",
      _id: "16",
      connectedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Paula White",
      headline: "Customer Support",
      _id: "17",
      connectedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Quinn Blue",
      headline: "Social Media Manager",
      _id: "18",
      connectedAt: new Date(Date.now() - 450 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Ray Gray",
      headline: "IT Consultant",
      _id: "19",
      connectedAt: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Sara Red",
      headline: "Research Scientist",
      _id: "20",
      connectedAt: new Date(Date.now() - 550 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Tom Orange",
      headline: "Operations Manager",
      _id: "21",
      connectedAt: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Uma Purple",
      headline: "Legal Advisor",
      _id: "22",
      connectedAt: new Date(Date.now() - 650 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Vera Pink",
      headline: "Public Relations",
      _id: "23",
      connectedAt: new Date(Date.now() - 700 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Will Brown",
      headline: "Accountant",
      _id: "24",
      connectedAt: new Date(Date.now() - 750 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Xena Grey",
      headline: "Data Analyst",
      _id: "25",
      connectedAt: new Date(Date.now() - 800 * 24 * 60 * 60 * 1000),
    },
  ];

  const formatConnectedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `Connected ${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Connected ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Connected ${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `Connected ${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };
  
  const allConnections = [...connections, ...mockData].map((connection) => ({
    ...connection,
    connectedAt: formatConnectedDate(connection?.connectedAt),
  }));

  console.log(allConnections);
  
  return (
    <Dialog
      useRegularButton
      buttonData={
        (userInfo?.connectionsCount >= 500
          ? "500+"
          : userInfo?.connectionsCount) + " connection(s)"
      }
      buttonClass="hover:underline cursor-pointer text-secondary self-start text-sm"
      AlertContent={
        <ConnectionsPresentation
          connections={allConnections}
          isMyProfile={isMyProfile}
          navigateTo={navigateTo}
          userInfo={userInfo}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          observerTarget={observerTarget}
        />
      }
    />
  );
}
