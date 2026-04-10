import type { Chat } from '../types/chat'

type Props = {
  chats: Chat[]
  activeChatId: string
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  disableNewChat?: boolean
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  disableNewChat = false,
}: Props) {
  return (
    <aside className="hidden w-72 flex-col border-r border-zinc-200 bg-zinc-50 sm:flex">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-4">
        <div className="min-w-0">
          <div className="truncate text-xs text-zinc-500">Select a conversation</div>
        </div>

        <button
          onClick={onNewChat}
          className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={disableNewChat}
        >
          New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-1">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                    : 'text-zinc-700 hover:bg-white/70'
                }`}
                type="button"
              >
                <div className="truncate font-medium">{chat.title}</div>
                <div className="mt-0.5 truncate text-xs text-zinc-500">
                  {chat.messages.at(-1)?.content ?? 'No messages'}
                </div>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
