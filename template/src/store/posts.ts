import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type PostWithUser } from '~/lib/posts'

interface PostsState {
  posts: PostWithUser[]
  isLoading: boolean
  error: string | null
  setPosts: (posts: PostWithUser[]) => void
  addPost: (post: PostWithUser) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const usePostsStore = create<PostsState>()(
  devtools(
    (set) => ({
      posts: [],
      isLoading: false,
      error: null,
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    })
  )
) 