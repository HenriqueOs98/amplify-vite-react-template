import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;
  const authCookie = cookieStore.get('pb_auth');
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');

  if (authCookie) {
    await db.loadAuthFromCookie(authCookie.value);
  }

  try {
    let filter = '';
    if (title) {
      filter = `title ~ "${title}"`;
    }

    const allPosts = await db.client.collection("posts").getList(1, 200, {
      sort: '-created',
      expand: 'author',
      filter: filter,
    });

    const formattedPosts = allPosts.items.map(item => ({
      id: item.id,
      author: item.expand?.author?.username || 'Unknown',
      title: item.title,
      content: item.content,
      createdAt: new Date(item.created),
      visibility: item.visibility,
      likes_count: item.likes_count,
      comments_count: item.comments_count,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

