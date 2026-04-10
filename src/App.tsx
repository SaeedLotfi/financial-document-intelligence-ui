import { useMemo, useState } from 'react'
import ChatComposer from './components/ChatComposer'
import ChatHeader from './components/ChatHeader'
import ChatSidebar from './components/ChatSidebar'
import MessageBubble from './components/MessageBubble'
import type { Chat } from './types/chat'

export default function App() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'chat-1',
      title: 'Welcome',
      userId: null,
      documentUploaded: false,
      messages: [
        {
          id: 'm-1',
          role: 'assistant',
          content:
            "# Welcome\n\nUpload a file and ask a question about it. Here are a few things I can do:\n\n- Summarize a document\n- Extract key figures\n- Answer questions with citations\n\nTip: try a link like [Vite](https://vitejs.dev/) and some `inline code`.",
          time: '9:41 AM',
        },
        {
          id: 'm-2',
          role: 'user',
          content:
            "Can you summarize the uploaded document?\n\nPlease include:\n\n1. A short TL;DR\n2. A bullet list of key points\n3. Any risks or anomalies you notice",
          time: '9:42 AM',
        },
        {
          id: 'm-3',
          role: 'assistant',
          content:
            "Absolutely. Once the file is uploaded, I can:\n\n- Summarize it\n- Extract key points\n- Answer questions\n\n```ts\n// Example: extracted metric\nconst revenue = 125_000_000\n```\n\n> If you want, ask: *\"What changed vs last quarter?\"*",
          time: '9:42 AM',
        },
      ],
    },
    {
      id: 'chat-2',
      title: 'Quarterly report',
      userId: null,
      documentUploaded: false,
      messages: [
        {
          id: 'm-4',
          role: 'user',
          content: 'Summarize the key changes vs last quarter.',
          time: '10:05 AM',
        },
        {
          id: 'm-5',
          role: 'assistant',
          content: 'Upload the report and I will highlight the biggest deltas and risks.',
          time: '10:06 AM',
        },
      ],
    },
  ])

  const [activeChatId, setActiveChatId] = useState<string>(chats[0]?.id ?? '')

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? chats[0],
    [chats, activeChatId],
  )

  const messages = activeChat?.messages ?? []

  const canCreateNewChat = chats.length === 0 ? true : Boolean(chats[0]?.title)

  function appendMessageToChat(chatId: string, message: Chat['messages'][number]) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat
        return { ...chat, messages: [...chat.messages, message] }
      }),
    )
  }

  function setChatUserId(chatId: string, userId: string) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat
        return { ...chat, userId }
      }),
    )
  }

  function setChatTitle(chatId: string, title: string) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat
        return { ...chat, title }
      }),
    )
  }

  function setChatDocumentUploaded(chatId: string, documentUploaded: boolean) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat
        return { ...chat, documentUploaded }
      }),
    )
  }

  function generateUserId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }

  async function uploadDocument(file: File, userId: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', userId)

    const res = await fetch('http://127.0.0.1:8000/process-document', {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Upload failed (${res.status})`)
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) return (await res.json()) as unknown
    return await res.text()
  }

  async function askFollowUp(question: string, userId: string) {
    const url = new URL('http://127.0.0.1:8000/follow-up')
    url.searchParams.set('user_id', userId)
    url.searchParams.set('question', question)

    const res = await fetch(url.toString(), { method: 'POST' })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Question failed (${res.status})`)
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) return (await res.json()) as unknown
    return await res.text()
  }

  async function handleSubmit({
    file,
    question,
    setPhase,
  }: {
    file: File | null
    question: string
    setPhase: (phase: 'idle' | 'uploading' | 'thinking') => void
  }) {
    if (!activeChat) return
    if (!activeChat.documentUploaded && !file) return

    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const chatId = activeChat.id

    const userId = activeChat.userId ?? generateUserId()
    if (!activeChat.userId) {
      setChatUserId(chatId, userId)
    }

    if (!activeChat.title) {
      setChatTitle(chatId, question)
    }

    appendMessageToChat(chatId, {
      id: `u-${now.getTime()}`,
      role: 'user',
      content: question,
      time,
    })

    function formatAssistantContent(answer: unknown) {
      if (typeof answer === 'string') return answer

      if (answer && typeof answer === 'object') {
        const parsedDocument = (answer as { parsed_document?: unknown }).parsed_document
        if (parsedDocument && typeof parsedDocument === 'object') {
          const rawText = (parsedDocument as { raw_text?: unknown }).raw_text
          if (typeof rawText === 'string' && rawText.trim().length > 0) {
            return rawText
          }
        }

        return `\`\`\`json\n${JSON.stringify(answer, null, 2)}\n\`\`\``
      }

      return String(answer)
    }

    try {
      if (!activeChat.documentUploaded) {
        if (!file) return
        setPhase('uploading')
        await uploadDocument(file, userId)
        setChatDocumentUploaded(chatId, true)
      }

      setPhase('thinking')
      const answer = await askFollowUp(question, userId)

      appendMessageToChat(chatId, {
        id: `a-${now.getTime() + 1}`,
        role: 'assistant',
        content: formatAssistantContent(answer),
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      appendMessageToChat(chatId, {
        id: `e-${now.getTime() + 2}`,
        role: 'assistant',
        content: `**Error:** ${message}`,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      })
    }
  }

  function handleNewChat() {
    if (!canCreateNewChat) return
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    const userId = generateUserId()

    const newChat: Chat = {
      id: userId,
      title: '',
      userId,
      documentUploaded: false,
      messages: [
        {
          id: `m-${now.getTime()}`,
          role: 'assistant',
          content: 'Upload a file and ask a question about it.',
          time,
        },
      ],
    }

    setChats((prev) => [newChat, ...prev])
    setActiveChatId(userId)
  }

  return (
    <div dir="ltr" className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex h-screen max-w-6xl">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onNewChat={handleNewChat}
          disableNewChat={!canCreateNewChat}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <ChatHeader
            title="Financial Document Intelligence System"
            onNewChat={handleNewChat}
            disableNewChat={!canCreateNewChat}
          />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
              {messages.map((message) => {
                return <MessageBubble key={message.id} message={message} />
              })}
            </div>
          </main>

          <ChatComposer onSubmit={handleSubmit} requireFile={!activeChat?.documentUploaded} />
        </div>
      </div>
    </div>
  );
}
