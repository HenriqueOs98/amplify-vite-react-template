export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  createdAt: Date | string;
  likes_count: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  post: string;
  author: string;
  content: string;
  createdAt: Date | string;
  parent_comment?: string;
}

export interface Like {
  id: string;
  user: string;
  post: string;
}

export interface Connection {
  id: string;
  follower: string;
  following: string;
  status: 'pending' | 'accepted';
}

