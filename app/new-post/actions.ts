'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
// new-post/actions.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDraft = async (keywords: string) => {
  const prompt = `Write a blog post draft based on these keywords: ${keywords}. Be informative, concise, and engaging.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // You can use 'gpt-4' if supported
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content?.trim() ?? 'No content generated';
  } catch (error) {
    console.error('Error generating draft:', error);
    throw new Error('Failed to generate draft');
  }
};

interface NewPostParams {
  authorId: number
  title: string
  content?: string | undefined
}

export const newPost = async ({ title, content, authorId }: NewPostParams) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          id: Number(authorId),
        },
      },
    },
  })

  revalidatePath('/', 'page')

  return post
}
