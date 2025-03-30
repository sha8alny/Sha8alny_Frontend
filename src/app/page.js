"use client";

// TODO: Implement Multiple Images Case
import {
  Bookmark,
  Users,
  TrendingUp,
  BriefcaseBusiness,
  BadgeCheck,
  Calendar,
  MessageSquare,
  Settings,
  ChartNoAxesCombined,
} from "lucide-react";
import ProfileCard from "./components/layout/ProfileCard";
import { Post } from "./components/modules/feed/Post";
import UserSmallCard from "./components/layout/UserSmallCard";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";
import { useState } from "react";
import SuggestedUsers from "./components/layout/SuggestedUsers";
import SuggestedUsersContainer from "./components/modules/profile/container/SuggestedUsersContainer";



const zhf = "/zhfman.jpg";
const Ezz = "/ease.jpg";

const userInfo = {
  name: "Hussein Essam",
  isPremium: false,
  expiryDate: "2026-12-12",
  connections: 50,
  jobApplications: 2,
  messages: 10,
  job: "Ex-QA Intern @ Siemens DISW",
  location: "Cairo, Egypt",
  workPlace: "Siemens DISW",
};

const QuickAccessIcons = [
  {
    icon: Bookmark,
    className: "text-blue-500 fill-current",
    title: "Saved Posts",
  },
  {
    icon: BriefcaseBusiness,
    title: "My Jobs",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Analytics",
  },
  {
    icon: Settings,
    title: "Settings",
  },
];

const TryPremium = () => {
  return (

    <div className="p-4 w-full bg-[#1b1f23] border border-[#111] flex items-center gap-1 rounded-3xl">
      <BadgeCheck className="size-5 text-yellow-500" />
      <button className="hover:underline text-sm font-semibold">
        Try Premium for free
      </button>
    </div>
  );
};

const QuickAccess = () => {
  return (
    <div className="p-4 bg-[#1b1f23] w-full rounded-3xl border-[#111] border shadow-lg flex flex-col gap-2">
      {QuickAccessIcons.map((icon, index) => (
        <div key={index} className="flex gap-2 items-center">
          <icon.icon className={`size-4 ${icon.className ?? ""}`} />
          <button className="hover:underline text-sm font-semibold">
            {icon.title}
          </button>
        </div>
      ))}
    </div>
  );
};


export default function Page() {
  return (
    <div className="space-y-8 bg-black text-white">
      <div className="gap-4 px-32 flex">
        <div className="flex-1 rounded-lg flex flex-col gap-2 items-center">
          <ProfileCard userInfo={userInfo} />
          <QuickAccess />
          {!userInfo.isPremium && <TryPremium />}
          <Stats userInfo={userInfo} />
          <button className="w-full h-14 bg-white hover:bg-gray-200 ease-in-out duration-500 text-black rounded-full font-bold p-2">
            Post
          </button>
        </div>
        <div className="flex-[3_1_0] flex flex-col px-14 rounded-lg">
          {Posts.map((post, index) => (
            <Post key={index} cardInfo={post} />
          ))}
        </div>
        <div className="flex-[1.4_1_0] rounded-lg space-y-2">
          <TrendingTopics trendingTopics={trendingTopics} />
          <SuggestedUsersContainer title="People You May Know" users={PeopleYouMayKnow} />
          <Footer />
        </div>


      </div>
    </div>
  );
}

const Stats = ({ userInfo }) => {
  const [isPremium, setIsPremium] = useState(userInfo.isPremium);
  const trackedStats = [
    { name: "Connections", icon: Users },
    { name: "Job Applications", icon: BriefcaseBusiness },
    { name: "Messages", icon: MessageSquare },
    { name: "Plan Expiry Date", icon: Calendar },
  ];
  const determineStat = (stat) => {
    const getColor = (value, limit) => {
      const ratio = value / limit;
      if (ratio == 1) return "text-red-500 font-semibold";
      if (ratio >= 0.9) return "text-red-500";
      if (ratio >= 0.75) return "text-orange-400";
      if (ratio >= 0.5) return "text-yellow-400";
      return "text-green-400";
    };

    switch (stat.name) {
      case "Connections":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(userInfo.connections, 50)} text-sm`}>
            {userInfo.connections}/<span className="font-bold">50</span>
          </span>
        );

      case "Job Applications":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(userInfo.jobApplications, 5)} text-sm`}>
            {userInfo.jobApplications}/<span className="font-bold">5</span>
          </span>
        );

      case "Messages":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(userInfo.messages, 10)} text-sm`}>
            {userInfo.messages}/<span className="font-bold">10</span>
          </span>
        );

      case "Plan Expiry Date":
        if (isPremium) {
          if (isExpired) {
            return (
              <span className="text-red-400 text-sm font-bold">Expired</span>
            );
          }
          return (
            <span className="text-green-400 text-sm font-bold">
              {userInfo.expiryDate}
            </span>
          );
        }
        return (
          <span className="text-sm text-yellow-500 font-semibold">N/A</span>
        );

      default:
        return null;
    }
  };

  const isExpired = new Date(userInfo.expiryDate) < new Date();
  return (
    <div className="flex flex-col w-full border-[#111] bg-[#1b1f23] border rounded-2xl shadow-sm p-4">
      <h2 className="text font-bold mb-4">
        Your Current Plan:{" "}
        <span
          className={
            isPremium
              ? "text-yellow-500 font-black"
              : "text-green-500 font-semibold"
          }
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </h2>
      <div className="flex flex-col gap-2">
        {trackedStats.map((stat, index) => (
          <div key={index} className="flex items-center">
            <stat.icon className="size-5 mr-2" />
            <p className="text-sm text-white mr-2">{stat.name}: </p>
            {determineStat(stat)}
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendingTopics = ({ trendingTopics }) => {
  return (
    <div className="bg-[#1b1f23] border-[#111] border rounded-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="size-5 mr-2" />
        Trending Topics
      </h2>
      <ul className="space-y-2">
        {trendingTopics.map((topic) => (
          <li key={topic.title}>
            <p className="text-white font-semibold hover:underline cursor-pointer">
              #{topic.title}
            </p>
            <p className="text-gray-400 text-xs">
              {topic.count} people talking about this
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PeopleYouMayKnow = [
  {
    name: "Ziad Hesham",
    relation: "2nd",
    job: "Computer Engineering Studentaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    image: zhf,
  },
  {
    name: "Ezz Selim",
    relation: "3rd",
    job: "Computer engineering student",
    image: Ezz,
  },
  {
    name: "Ali Essam",
    relation: "3rd+",
    job: "Software Engineer @ Amazon",
    image: "https://picsum.photos/200",
  },
];

const trendingTopics = [
  {
    title: "Technology",
    count: "1.5k",
  },
  {
    title: "Programming",
    count: "1.2k",
  },
  {
    title: "Software",
    count: "1.1k",
  },
  {
    title: "Engineering",
    count: "1k",
  },
];


const Posts = [
  {
    "image": "https://picsum.photos/200/200",
    "name": "Hussein Ahmed",
    "username": "husseinahmed",
    "relation": "2nd",
    "job": "Software Engineer at XYZ Company",
    "timePosted": "2025-03-16T10:30:00Z",
    "description": "Just completed an amazing project on React and Next.js. Feeling proud!",
    "hasMedia": true,
    "media": "https://picsum.photos/600/400",
    "likes": 125,
    "reposts": 30,
    "views": 1050,
    "comments": [
      {
        "photo": "https://picsum.photos/40/40",
        "name": "Mona Ali",
        "timePosted": "2025-03-16T11:00:00Z",
        "post": "Congrats! That sounds amazing!",
        "likes": 10
      },
      {
        "photo": "https://picsum.photos/40/40",
        "name": "Ali Hassan",
        "timePosted": "2025-03-16T12:00:00Z",
        "post": "Great work! Looking forward to seeing more.",
        "likes": 5
      }
    ]
  },
  {
    "image": "https://picsum.photos/200/200",
    "name": "Sarah Khaled",
    "username": "sarahkhaled",
    "relation": "1st",
    "job": "Product Manager at ABC Corp",
    "timePosted": "2025-03-15T09:00:00Z",
    "description": "Had a great time presenting our new product roadmap. Exciting times ahead!",
    "hasMedia": false,
    "likes": 200,
    "reposts": 50,
    "views": 3000,
    "comments": [
      {
        "photo": "https://picsum.photos/40/40",
        "name": "Ahmed Samir",
        "username": "ahmedsamir",
        "timePosted": "2025-03-15T09:30:00Z",
        "post": "Looking forward to the launch!",
        "likes": 20
      }
    ]
  },
  {
    "image": "https://picsum.photos/200/200",
    "name": "Mohamed Ayman",
    "username": "mohamedayman",
    "relation": "3rd",
    "job": "UI/UX Designer",
    "timePosted": "2025-03-14T14:00:00Z",
    "description": "Sharing some of my recent design concepts. Feedback is welcome!",
    "hasMedia": true,
    "media": "https://picsum.photos/600/400",
    "likes": 75,
    "reposts": 15,
    "views": 930,
    "comments": []
  },
  {
    "image": "https://picsum.photos/200/200",
    "name": "Laila Omar",
    "username": "lailaomar",
    "relation": "2nd",
    "job": "Data Scientist",
    "timePosted": "2025-03-13T08:00:00Z",
    "description": "Finally published my research paper on AI and NLP. It's been a long journey!",
    "hasMedia": false,
    "likes": 300,
    "reposts": 60,
    "views": 5000,
    "comments": [
      {
        "photo": "https://picsum.photos/40/40",
        "name": "Youssef Ibrahim",
        "username": "youssefibrahim",
        "timePosted": "2025-03-13T08:30:00Z",
        "post": "Congrats! Can't wait to read it!",
        "likes": 35
      }
    ]
  },
  {
    "image": "https://picsum.photos/200/200",
    "name": "Amira Fahmy",
    "username": "amirafahmy",
    "relation": "1st",
    "job": "Backend Developer",
    "timePosted": "2025-03-12T16:00:00Z",
    "description": "Just wrapped up building a new API. The performance boost is incredible!",
    "hasMedia": true,
    "media": "https://picsum.photos/600/400",
    "likes": 150,
    "reposts": 40,
    "views": 2500,
    "comments": [
      {
        "photo": "https://picsum.photos/40/40",
        "name": "Khaled Mostafa",
        "username": "khaledmostafa",
        "timePosted": "2025-03-12T16:30:00Z",
        "post": "Nice work! Would love to see the benchmarks.",
        "likes": 15
      },
      {
        "photo": "https://picsum.photos/40/40",
        "name": "Nourhan Salah",
        "username": "nourhansalah",
        "timePosted": "2025-03-12T17:00:00Z",
        "post": "Looks amazing! Keep it up!",
        "likes": 8
      }
    ]
  }
]
