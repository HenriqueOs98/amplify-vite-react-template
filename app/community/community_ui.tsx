'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { usePosts, useComments } from './community_hooks'
import { formatDate } from './community_helpers'
import { MAX_POST_LENGTH, MIN_POST_LENGTH } from './constants'
import { Post, Comment } from './types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp, MessageSquare, Search } from 'lucide-react'
import * as communityService from './community_service'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/src/hooks/useAuth"

export function CommunityContent() {
  const { user, isAuthenticated } = useAuth()
  const { posts, loading: postsLoading, error: postsError, addPost, setPosts } = usePosts()
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      unsubscribe = communityService.subscribeToRealTimeUpdates('posts', (updatedPost) => {
        setPosts(prevPosts => {
          const index = prevPosts.findIndex(post => post.id === updatedPost.id);
          if (index !== -1) {
            const newPosts = [...prevPosts];
            newPosts[index] = {
              ...newPosts[index],
              ...updatedPost,
              author: updatedPost.expand?.author?.username || newPosts[index].author,
            };
            return newPosts;
          } else {
            return [
              {
                id: updatedPost.id,
                author: updatedPost.expand?.author?.username || 'Unknown',
                title: updatedPost.title,
                content: updatedPost.content,
                createdAt: new Date(updatedPost.created),
                likes_count: updatedPost.likes_count,
                comments_count: updatedPost.comments_count,
              },
              ...prevPosts
            ];
          }
        });
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setPosts]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPostTitle.trim().length > 0 && newPostContent.trim().length >= MIN_POST_LENGTH) {
      try {
        if (!isAuthenticated) {
          throw new Error('You must be logged in to create a post');
        }
        await addPost(newPostTitle, newPostContent)
        setNewPostTitle('')
        setNewPostContent('')
      } catch (err) {
        console.error('Error submitting post:', err)
        setError(err instanceof Error ? err.message : 'Failed to create post. Please try again.')
      }
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (searchQuery.trim()) {
      setIsSearching(true)
      try {
        const results = await communityService.searchPosts(searchQuery)
        setSearchResults(results.items)
      } catch (err) {
        setError('Failed to search posts. Please try again.')
      } finally {
        setIsSearching(false)
      }
    }
  }

  if (postsLoading) return <div>Loading...</div>
  if (postsError) return <div>Error: {postsError}</div>

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : <Search className="w-4 h-4" />}
        </Button>
      </form>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Search Results</h2>
          {searchResults.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {isAuthenticated && (
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <Input
            type="text"
            placeholder="Post title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full"
            maxLength={100}
          />
          <Textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your thoughts with the community..."
            className="w-full"
            maxLength={MAX_POST_LENGTH}
          />
          <div className="flex justify-between items-center">
            <span>{newPostContent.length}/{MAX_POST_LENGTH}</span>
            <Button type="submit" disabled={newPostTitle.trim().length === 0 || newPostContent.length < MIN_POST_LENGTH}>Post</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const { user, isAuthenticated } = useAuth()
  const { comments, addComment } = useComments(post.id)
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newComment.trim().length > 0) {
      try {
        if (!isAuthenticated) {
          throw new Error('You must be logged in to add a comment');
        }
        await addComment(newComment)
        setNewComment('')
      } catch (err) {
        setError('Failed to add comment. Please try again.')
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{post.author}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Like ({post.likes_count})
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Comment ({comments.length})
        </Button>
      </CardFooter>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isAuthenticated && (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full"
            />
            <Button type="submit" disabled={newComment.trim().length === 0}>Comment</Button>
          </form>
        )}
        <div className="mt-4 space-y-4">
          {comments.map((comment: Comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="flex space-x-4">
      <Avatar>
        <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{comment.author}</p>
        <p>{comment.content}</p>
        <p className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</p>
      </div>
    </div>
  )
}

