"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, type PostWithUser } from "~/lib/posts";
import { usePostsStore } from "~/store";

export function Posts() {
  const [newPostName, setNewPostName] = useState("");
  const queryClient = useQueryClient();
  const { posts, setPosts, setLoading, setError } = usePostsStore();

  const { data: fetchedPosts, isLoading } = useQuery<PostWithUser[], Error>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // Update Zustand store when data changes
  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    }
  }, [fetchedPosts, setPosts]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPostName("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full gap-3">
        <input
          type="text"
          value={newPostName}
          onChange={(e) => setNewPostName(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newPostName.trim()) {
              createPostMutation.mutate(newPostName.trim());
            }
          }}
        />
        <button
          onClick={() => {
            if (newPostName.trim()) {
              createPostMutation.mutate(newPostName.trim());
            }
          }}
          className="rounded-xl bg-white/10 px-6 py-3 text-white transition-all hover:bg-white/20 hover:shadow-lg hover:shadow-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          Post
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="group flex flex-col gap-3 rounded-xl bg-white/10 p-4 text-white transition-all hover:bg-white/15 hover:shadow-lg hover:shadow-white/5"
          >
            <h3 className="text-xl font-bold">{post.name}</h3>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="font-medium">{post.user.name}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 