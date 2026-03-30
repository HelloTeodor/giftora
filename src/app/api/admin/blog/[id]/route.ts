import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, image, authorName, published, metaTitle, metaDesc, tags } = body;

    if (slug) {
      const conflict = await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } });
      if (conflict) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    const publishedAt = published && !existing?.published ? new Date() : existing?.publishedAt;

    const post = await prisma.blogPost.update({
      where: { id },
      data: { title, slug, excerpt, content, image, authorName, published, publishedAt, metaTitle, metaDesc, tags: tags ?? [] },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
