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

  function handleNewChat() {
    const now = new Date()
    const id = `chat-${now.getTime()}`
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    const newChat: Chat = {
      id,
      title: 'New chat',
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
    setActiveChatId(id)
  }

  return (
    <div dir="ltr" className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex h-screen max-w-6xl">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onNewChat={handleNewChat}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <ChatHeader
            title="Financial Document Intelligence System"
            onNewChat={handleNewChat}
          />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
              {messages.map((message) => {
                return <MessageBubble key={message.id} message={message} />
              })}
            </div>
          </main>

          <ChatComposer />
        </div>
      </div>
    </div>
  );
}
