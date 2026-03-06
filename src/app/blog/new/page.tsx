'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function NewBlogPage() {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function insertMarkdown(transform: (sel: string, before: string, after: string) => string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = ta.value.slice(start, end)
    const result = transform(sel, ta.value.slice(0, start), ta.value.slice(end))
    // transform returns full new value
    setContent(result)
    requestAnimationFrame(() => {
      ta.focus()
    })
  }

  function wrapSelection(open: string, close: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = content.slice(start, end)
    const newContent = content.slice(0, start) + open + sel + close + content.slice(end)
    setContent(newContent)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + open.length, end + open.length)
    })
  }

  function prependLine(prefix: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const newContent = content.slice(0, lineStart) + prefix + content.slice(lineStart)
    setContent(newContent)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + prefix.length, start + prefix.length)
    })
  }

  function insertAtCursor(text: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newContent = content.slice(0, start) + text + content.slice(end)
    setContent(newContent)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + text.length, start + text.length)
    })
  }

  function handleBold() {
    wrapSelection('**', '**')
  }

  function handleItalic() {
    wrapSelection('*', '*')
  }

  function handleHeading(level: number) {
    prependLine('#'.repeat(level) + ' ')
  }

  function handleCode() {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = content.slice(start, end)
    if (sel.includes('\n')) {
      const open = '```\n'
      const close = '\n```'
      const newContent = content.slice(0, start) + open + sel + close + content.slice(end)
      setContent(newContent)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(start + open.length, end + open.length)
      })
    } else {
      wrapSelection('`', '`')
    }
  }

  function handleUL() {
    prependLine('- ')
  }

  function handleOL() {
    prependLine('1. ')
  }

  function handleHR() {
    insertAtCursor('\n---\n')
  }

  function handleNewline() {
    insertAtCursor('  \n')
  }

  function handleLink() {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = content.slice(start, end)
    const text = sel || 'link text'
    const inserted = `[${text}](url)`
    const newContent = content.slice(0, start) + inserted + content.slice(end)
    setContent(newContent)
    requestAnimationFrame(() => {
      ta.focus()
      // Select the 'url' part
      const urlStart = start + text.length + 3
      ta.setSelectionRange(urlStart, urlStart + 3)
    })
  }

  async function handleSubmit() {
    setError('')
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          published,
        }),
      })

      if (res.status === 403) {
        setError('Admin access required.')
        return
      }
      if (res.status === 409) {
        setError('A post with this title already exists.')
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }

      router.push('/blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toolbarBtn =
    'px-2 py-1 text-xs font-mono rounded border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors'

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-col px-6 py-6">
      {/* Header row */}
      <div className="mb-4 flex items-center gap-4">
        <Link href="/blog" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← Back
        </Link>
        <input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-xl font-bold text-neutral-100 placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
      </div>

      {/* Excerpt + Tags row */}
      <div className="mb-4 flex gap-4">
        <textarea
          placeholder="Excerpt (short description)..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="flex-1 resize-none rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-64 rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
      </div>

      {/* Editor + Preview */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Left: toolbar + textarea */}
        <div className="flex flex-1 flex-col rounded-md border border-neutral-800">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 border-b border-neutral-800 px-3 py-2">
            <button onClick={handleBold} className={toolbarBtn} title="Bold">
              B
            </button>
            <button onClick={handleItalic} className={toolbarBtn} title="Italic">
              I
            </button>
            <button onClick={() => handleHeading(1)} className={toolbarBtn} title="Heading 1">
              H1
            </button>
            <button onClick={() => handleHeading(2)} className={toolbarBtn} title="Heading 2">
              H2
            </button>
            <button onClick={() => handleHeading(3)} className={toolbarBtn} title="Heading 3">
              H3
            </button>
            <button onClick={handleCode} className={toolbarBtn} title="Code">
              {'</>'}
            </button>
            <button onClick={handleUL} className={toolbarBtn} title="Unordered list">
              UL
            </button>
            <button onClick={handleOL} className={toolbarBtn} title="Ordered list">
              OL
            </button>
            <button onClick={handleHR} className={toolbarBtn} title="Horizontal rule">
              HR
            </button>
            <button onClick={handleLink} className={toolbarBtn} title="Link">
              🔗
            </button>
            <button onClick={handleNewline} className={toolbarBtn} title="Hard line break (two spaces + newline)">
              ↵
            </button>
          </div>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post in Markdown..."
            className="flex-1 resize-none bg-neutral-950 px-4 py-3 font-mono text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none"
          />
        </div>

        {/* Right: preview */}
        <div className="flex-1 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-950 px-6 py-4">
          {content ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">Preview will appear here...</p>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-400">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-700 accent-cyan-500"
          />
          Publish immediately
        </label>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-400">{error}</span>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-md bg-cyan-600 px-5 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Blog'}
          </button>
        </div>
      </div>
    </div>
  )
}
