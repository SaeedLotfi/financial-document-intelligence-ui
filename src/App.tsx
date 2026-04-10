import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

export default function App() {
  const messages = [
    {
      id: 1,
      role: 'assistant',
      content:
        "# Welcome\n\nUpload a file and ask a question about it. Here are a few things I can do:\n\n- Summarize a document\n- Extract key figures\n- Answer questions with citations\n\nTip: try a link like [Vite](https://vitejs.dev/) and some `inline code`.",
      time: '9:41 AM',
    },
    {
      id: 2,
      role: 'user',
      content:
        "Can you summarize the uploaded document?\n\nPlease include:\n\n1. A short TL;DR\n2. A bullet list of key points\n3. Any risks or anomalies you notice",
      time: '9:42 AM',
    },
    {
      id: 3,
      role: 'assistant',
      content:
        "Absolutely. Once the file is uploaded, I can:\n\n- Summarize it\n- Extract key points\n- Answer questions\n\n```ts\n// Example: extracted metric\nconst revenue = 125_000_000\n```\n\n> If you want, ask: *\"What changed vs last quarter?\"*",
      time: '9:42 AM',
    },
  ];

  return (
    <div dir="ltr" className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex h-screen max-w-5xl flex-col">
        <header className="border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Chat UI</h1>
              <p className="text-sm text-zinc-500">Ask questions about uploaded files</p>
            </div>

            <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50">
              New chat
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {messages.map((message) => {
              const isUser = message.role === 'user';

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      isUser
                        ? 'bg-emerald-600 text-white'
                        : 'border border-zinc-200 bg-white text-zinc-900'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          isUser ? 'text-white/80' : 'text-zinc-500'
                        }`}
                      >
                        {isUser ? 'You' : 'Assistant'}
                      </span>
                      <span
                        className={`text-xs ${
                          isUser ? 'text-white/70' : 'text-zinc-400'
                        }`}
                      >
                        {message.time}
                      </span>
                    </div>
                    <div dir="ltr" className="text-left text-sm leading-7 sm:text-[15px]">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: (props) => (
                            <a
                              {...props}
                              className="underline underline-offset-2 hover:opacity-90"
                              target="_blank"
                              rel="noreferrer"
                            />
                          ),
                          code: ({ className, children, ...props }) => (
                            <code
                              {...props}
                              className={`rounded bg-black/5 px-1 py-0.5 font-mono text-[0.95em] ${className ?? ''}`}
                            >
                              {children}
                            </code>
                          ),
                          pre: ({ children, ...props }) => (
                            <pre
                              {...props}
                              className="mt-2 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                            >
                              {children}
                            </pre>
                          ),
                          ul: (props) => (
                            <ul {...props} className="my-2 list-disc pl-5" />
                          ),
                          ol: (props) => (
                            <ol {...props} className="my-2 list-decimal pl-5" />
                          ),
                          li: (props) => <li {...props} className="my-1" />,
                          p: (props) => <p {...props} className="my-2" />,
                          h1: (props) => (
                            <h1 {...props} className="my-2 text-base font-semibold" />
                          ),
                          h2: (props) => (
                            <h2 {...props} className="my-2 text-sm font-semibold" />
                          ),
                          h3: (props) => (
                            <h3 {...props} className="my-2 text-sm font-semibold" />
                          ),
                          blockquote: (props) => (
                            <blockquote
                              {...props}
                              className="my-2 border-l-2 border-zinc-300 pl-3 text-zinc-600"
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="border-t border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M4 16.5v1.75A1.75 1.75 0 0 0 5.75 20h12.5A1.75 1.75 0 0 0 20 18.25V16.5" />
                  </svg>
                  <span>Upload file</span>
                  <input type="file" className="hidden" />
                </label>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                  No file selected
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <textarea
                  rows={4}
                  placeholder="Ask a question about your file..."
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300 sm:text-[15px]"
                />

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500 sm:text-sm">
                    Supported: PDF, DOCX, TXT, images
                  </p>

                  <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M12 6l6 6-6 6" />
                    </svg>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
