'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { newPost, generateDraft } from './actions'

interface Author {
  id: number
  name: string | null
}

interface NewPostFormProps {
  authors: Author[]
}

export default function NewPostForm({ authors }: NewPostFormProps) {
  const [generatedDraft, setGeneratedDraft] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{
    authorId: number
    title: string
    content?: string
    keywords?: string
  }>()

  const router = useRouter()

  // Function to handle draft generation
  const handleGenerateDraft = async () => {
    setIsLoading(true)
    try {
        const keywords = (document.getElementById('keywords') as HTMLInputElement)?.value || ''
        if (!keywords) {
        alert('Please enter some keywords to generate a draft.')
        setIsLoading(false)
        return
      }

      const draft = await generateDraft(keywords)
      setGeneratedDraft(draft)
      setValue('content', draft)
    } catch (error) {
      console.error('Failed to generate draft:', error)
      alert('Failed to generate draft. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-center font-bold text-lg my-4">New Post</h1>
      <form
        className="flex flex-col gap-4 max-w-lg mx-auto"
        onSubmit={handleSubmit(async data => {
          await newPost(data)
          router.push('/')
        })}
      >
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="author">
            Author
          </label>
          <select
            className="p-2 border border-gray-400 rounded-sm"
            id="author"
            {...register('authorId', { required: true })}
          >
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          {errors.authorId && <p className="text-red-500 font-bold">Author selection is required.</p>}
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="p-2 border border-gray-400 rounded-sm"
            placeholder="An eye-catching blog post"
            {...register('title', { required: true })}
          />
          {errors.title && <p className="text-red-500 font-bold">Title is required.</p>}
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="keywords">
            Content draft keywords
          </label>
          <div className="flex items-center gap-2">
          <input
            id="keywords"
            className="p-2 border border-gray-400 rounded-sm flex-1"
            placeholder="software development, AI, ChatGPT"
            {...register('keywords')}
            />

            <button
              type="button"
              className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold"
              onClick={handleGenerateDraft}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            className="p-2 border border-gray-400 rounded-sm"
            rows={5}
            {...register('content')}
          />
        </div>
        <button type="submit" className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold">
          Submit
        </button>
      </form>
    </>
  )
}
