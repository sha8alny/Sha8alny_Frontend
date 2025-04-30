"use client";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostPageContainer from "@/app/components/modules/company-page-author/container/PostPageContainer";

export default function PostPage(){
    const { username } = useParams();
    const searchParams = useSearchParams();
    const logo = searchParams.get("logo");
    return(
        <div className="space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
                <PostPageContainer username={username} logo={logo}/>
            </Suspense>
        </div>
    );
}