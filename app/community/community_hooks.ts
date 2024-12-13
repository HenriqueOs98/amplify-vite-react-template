import { useState, useEffect } from 'react'
import { Post, Comment } from './types'
import * as communityService from './community_service'

export function usePosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPosts() {
      try {
        const fetchedPosts = await communityService.fetchPosts()
        setPosts(fetchedPosts)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch posts')
        setLoading(false)
      }
    }
    loadPosts()

    communityService.subscribeToRealTimeUpdates('posts', (updatedPost) => {
      setPosts(prevPosts => {
        const index = prevPosts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          const newPosts = [...prevPosts];
          newPosts[index] = updatedPost;
          return newPosts;
        } else {
          return [updatedPost, ...prevPosts];
        }
      });
    });
  }, [userId])

  const addPost = async (title: string, content: string) => {
    try {
      const newPost = await communityService.createPost(userId, title, content)
      setPosts([newPost, ...posts])
      return newPost
    } catch (err) {
      console.error('Failed to create post:', err)
      throw err
    }
  }

  return { posts, loading, error, addPost, setPosts }
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadComments() {
      try {
        const fetchedComments = await communityService.fetchComments(postId)
        setComments(fetchedComments)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch comments')
        setLoading(false)
      }
    }
    loadComments()

    communityService.subscribeToRealTimeUpdates('comments', (updatedComment) => {
      if (updatedComment.post === postId) {
        setComments(prevComments => {
          const index = prevComments.findIndex(comment => comment.id === updatedComment.id);
          if (index !== -1) {
            const newComments = [...prevComments];
            newComments[index] = updatedComment;
            return newComments;
          } else {
            return [...prevComments, updatedComment];
          }
        });
      }
    });
  }, [postId])

  const addComment = async (author: string, content: string, parentCommentId?: string) => {
    try {
      const newComment = await communityService.createComment(postId, author, content, parentCommentId)
      setComments([...comments, newComment])
    } catch (err) {
      setError('Failed to create comment')
    }
  }

  return { comments, loading, error, addComment }
}

