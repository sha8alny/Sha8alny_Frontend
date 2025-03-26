"use client";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PostPageContainer from "@/app/components/modules/company-page-author/container/PostPageContainer";

function PostPage(){
    const { username } = useParams();
    const searchParams = useSearchParams();
    const logo = searchParams.get("logo");
    return(
        <div className="w-full" >
            <PostPageContainer username={username} logo={logo}/>
        </div>
    );
}

export default PostPage;