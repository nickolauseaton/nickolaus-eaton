'use client'

interface Post {
  id: number
  title: string
  content: string | null
  author: { 
    name: string | null //adding author name here
  }
}

interface Props {
  posts: Post[]
}

export const revalidate = 0

export default function HomePage({ posts }: Props) {
  return (
    <>
      <h1 className="text-center font-bold text-lg my-4">Posts</h1>
      <ul className="flex flex-wrap gap-4">
        {posts.map(post => (
          <li className="border border-gray-500 rounded-md shadow-md p-4 bg-white w-96" key={post.id}>
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Author:</strong> {post.author?.name || 'Unknown'}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
