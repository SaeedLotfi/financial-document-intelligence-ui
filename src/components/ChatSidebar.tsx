import type { Chat } from '../types/chat'

type Props = {
  chats: Chat[]
  activeChatId: string
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onNewChat: () => void
  disableNewChat?: boolean
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  disableNewChat = false,
}: Props) {
  return (
    <aside className="hidden w-72 flex-col border-r border-zinc-200 bg-zinc-50 sm:flex">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-6">
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
        {chats.length === 0 ? (
          <div className="px-3 py-4 text-sm text-zinc-500">
            No chats yet. Click <span className="font-medium text-zinc-700">New chat</span> to start.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId

              return (
                <div key={chat.id} className="flex items-stretch gap-1">
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                        : 'text-zinc-700 hover:bg-white/70'
                    }`}
                    type="button"
                  >
                    <div className="truncate font-medium">{chat.title || 'New chat'}</div>
                    <div className="mt-0.5 truncate text-xs text-zinc-500">
                      {chat.messages.at(-1)?.content ?? 'No messages'}
                    </div>
                  </button>

                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className={`flex shrink-0 items-center justify-center rounded-xl px-2 text-zinc-500 transition hover:bg-white/70 hover:text-zinc-700 ${
                      isActive ? 'bg-white ring-1 ring-zinc-200' : ''
                    }`}
                    type="button"
                    aria-label="Delete chat"
                    title="Delete chat"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 7h12m-1 0-.867 12.142A2 2 0 0 1 14.138 21H9.862a2 2 0 0 1-1.995-1.858L7 7m3 0V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"
                      />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </nav>
    </aside>
  )
}
