"use client";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getSavedPosts } from "@/app/services/post";
import { formatDistanceToNow } from "date-fns";
import SavedPostsPresentation from "../presentation/SavedPostsPresentation";

export default function SavedPostsContainer() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPerson, setSelectedPerson] = useState(null);
    const router = useRouter();

    const {
        data,
        isPending,
        isError,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["savedPosts"],
        queryFn: ({ pageParam = 1 }) => getSavedPosts(pageParam),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const posts = data?.pages.flatMap((page) =>
        Array.isArray(page) ? page : page.data ?? []);

    // Extract all unique tagged people with their full details
    const uniqueTaggedPeople = posts?.reduce((acc, post) => {
        if (!post.taggedPeople || post.taggedPeople.length === 0) return acc;
        
        post.taggedPeople.forEach(person => {
            if (!acc.some(p => p.userId === person.userId)) {
                acc.push(person);
            }
        });
        
        return acc;
    }, []);

    const handleLoadMore = () => hasNextPage && fetchNextPage();

    const filteredPosts = posts?.filter(post => {
        const matchesSearch = 
            post.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.headline?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPerson = selectedPerson
            ? post.taggedPeople?.some(person => person.userId === selectedPerson)
            : true;

        return matchesSearch && matchesPerson;
    });

    const handlePostClick = (postId, username) => {
        router.push(`/u/${username}/post/${postId}`);
    };

    const formatPostTime = (timeString) => {
        return formatDistanceToNow(new Date(timeString), { addSuffix: true });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedPerson(null);
    };

    return (
        <SavedPostsPresentation
            posts={filteredPosts}
            allTaggedPeople={uniqueTaggedPeople}
            searchQuery={searchQuery}
            selectedPerson={selectedPerson}
            isLoading={isPending}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onSearchChange={setSearchQuery}
            onPersonSelect={setSelectedPerson}
            onLoadMore={handleLoadMore}
            onPostClick={handlePostClick}
            onClearFilters={clearFilters}
            formatPostTime={formatPostTime}
        />
    );
}