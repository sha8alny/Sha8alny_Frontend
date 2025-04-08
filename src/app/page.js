"use client";

// TODO: Implement Multiple Images Case
import { Post } from "./components/modules/feed/Post";
import { useState } from "react";
import LeftSidebar from "./components/modules/feed/container/LeftSidebar";
import RightSidebarPresentation from "./components/modules/feed/presentation/RightSidebarPresentation";
import PostButton from "./components/modules/feed/container/PostButton";
import PostsContainer from "./components/modules/feed/container/PostsContainer";


export default function Page() {
  return (
    <div className="w-full overflow-y-auto">
      <div className="gap-4 px-4 md:px-16 pt-8 flex">
        <div className="hidden md:flex flex-1 rounded-lg flex-col gap-2 items-center">
          <LeftSidebar addButton />
        </div>
        <div className="md:flex-[2_1_0] flex flex-col md:mx-8 rounded-lg">
          <PostsContainer />
        </div>
        <div className="hidden md:block flex-1 space-y-2 drop-shadow-lg">
          <RightSidebarPresentation />
        </div>


      </div>
    </div>
  );
}


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
