import { db } from '@/src/db';
import { Post, Comment, Like } from './types';

export async function fetchPosts(): Promise<Post[]> {
  try {
    const records = await db.client.collection('posts').getList(1, 50, {
      sort: '-created',
      expand: 'author',
    });
    return records.items.map((record: any) => ({
      id: record.id,
      author: record.expand?.author?.username || 'Unknown',
      title: record.title,
      content: record.content,
      createdAt: new Date(record.created),
      likes_count: record.likes_count,
      comments_count: record.comments_count,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  try {
    const comments = await db.client.collection('comments').getList(1, 50, {
      filter: `post="${postId}"`,
      sort: '-created',
      expand: 'author',
    });
    return comments.items.map((comment: any) => ({
      id: comment.id,
      post: comment.post,
      author: comment.expand?.author?.username || 'Unknown',
      content: comment.content,
      createdAt: new Date(comment.created),
      parent_comment: comment.parent_comment,
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function createPost(userId: string, title: string, content: string): Promise<Post> {
  try {
    if (!db.client.authStore.isValid) {
      throw new Error('User is not authenticated');
    }
    const newPost = await db.client.collection('posts').create({
      author: userId,
      title,
      content,
      likes_count: 0,
      comments_count: 0,
    });
    return {
      id: newPost.id,
      author: db.client.authStore.model?.username || 'Unknown',
      title: newPost.title,
      content: newPost.content,
      createdAt: new Date(newPost.created),
      likes_count: newPost.likes_count,
      comments_count: newPost.comments_count,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create post: ${error.message}`);
    } else {
      throw new Error('Failed to create post: Unknown error');
    }
  }
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  try {
    if (!db.client.authStore.isValid) {
      throw new Error('User is not authenticated');
    }
    const newComment = await db.client.collection('comments').create({
      post: postId,
      author: db.client.authStore.model?.id,
      content,
    });
    return {
      id: newComment.id,
      post: newComment.post,
      author: db.client.authStore.model?.username || 'Unknown',
      content: newComment.content,
      createdAt: new Date(newComment.created),
      parent_comment: newComment.parent_comment,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export function subscribeToRealTimeUpdates(collection: string, callback: (data: any) => void): () => void {
  const subscription = db.client.collection(collection).subscribe("*", (e) => {
    callback({
      ...e.record,
      createdAt: new Date(e.record.created),
    });
  });

  return () => {
    db.client.collection(collection).unsubscribe(subscription);
  };
}

export async function searchPosts(query: string): Promise<{ items: Post[] }> {
  try {
    const searchResults = await db.client.collection('posts').getList(1, 20, {
      filter: `title ~ "${query}" || content ~ "${query}"`,
      sort: '-created',
      expand: 'author',
    });
    return {
      items: searchResults.items.map((post: any) => ({
        id: post.id,
        author: post.expand?.author?.username || 'Unknown',
        title: post.title,
        content: post.content,
        createdAt: new Date(post.created),
        likes_count: post.likes_count,
        comments_count: post.comments_count,
      })),
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

