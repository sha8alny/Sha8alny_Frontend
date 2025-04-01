function PostsContainer(){
    const {
        data: posts,
        isLoading,
        isError,
        error
      } = useQuery({
        queryKey: ["posts"],
        queryFn: () => fetchUserProfile(username),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
}

export default PostsContainer;