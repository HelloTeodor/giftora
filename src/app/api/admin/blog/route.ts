import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, image, authorName, published, metaTitle, metaDesc, tags } = body;

    if (!title || !slug || !content || !authorName) {
      return NextResponse.json({ error: 'Title, slug, content, and author are required' }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        authorId: session.user.id,
        authorName,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        metaTitle,
        metaDesc,
        tags: tags ?? [],
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
