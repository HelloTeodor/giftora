import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendVerificationEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  newsletter: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const name = `${data.firstName} ${data.lastName}`;

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        newsletterOptIn: data.newsletter || false,
      },
    });

    // Send verification email
    const token = generateToken();
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        type: 'EMAIL_VERIFY',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    await sendVerificationEmail(user.email, token, user.firstName || user.name || undefined).catch(() => {});

    return NextResponse.json({ message: 'Account created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
