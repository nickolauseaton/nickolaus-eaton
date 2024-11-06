'use server'
import prisma from '@/prisma/client'
import { cache } from 'react'
import HomePage from './home-page'

const getPosts = cache(async () => {
  return await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: {
        select: {
          name:true, //selecting the name field from author
        }
      }
    },
  })
})

export default async function Page() {
  const posts = await getPosts()
  return <HomePage posts={posts} />
}
