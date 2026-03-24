import type { RefObject } from 'react'

export function useMarkdownEditor(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  content: string,
  setContent: (content: string) => void,
) {
  function wrapSelection(open: string, close: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = content.slice(start, end)
    setContent(content.slice(0, start) + open + sel + close + content.slice(end))
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
    setContent(content.slice(0, lineStart) + prefix + content.slice(lineStart))
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
    setContent(content.slice(0, start) + text + content.slice(end))
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
      setContent(content.slice(0, start) + open + sel + close + content.slice(end))
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
    setContent(content.slice(0, start) + inserted + content.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      const urlStart = start + text.length + 3
      ta.setSelectionRange(urlStart, urlStart + 3)
    })
  }

  return {
    handleBold,
    handleItalic,
    handleHeading,
    handleCode,
    handleUL,
    handleOL,
    handleHR,
    handleNewline,
    handleLink,
  }
}
