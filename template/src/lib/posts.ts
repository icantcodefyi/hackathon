import { type Post } from "@prisma/client";

export type PostWithUser = Post & {
  user: {
    id: string;
    name: string;
  };
};

export async function getPosts(): Promise<PostWithUser[]> {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

export async function createPost(name: string): Promise<PostWithUser> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
} 