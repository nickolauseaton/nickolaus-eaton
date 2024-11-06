'use server'

import prisma from '@/prisma/client'
import NewPostForm from './NewPostForm'

export default async function NewPostPage() {
  // Fetch authors using Prisma directly on the server side
  const authors = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // Render the form and pass authors as props to the client-side component
  return <NewPostForm authors={authors} />;
}