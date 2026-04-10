type Props = {
  placeholder?: string
}

export default function ChatComposer({ placeholder = 'Ask a question about your file...' }: Props) {
  return (
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0-4 4m4-4 4 4M4 16.5v1.75A1.75 1.75 0 0 0 5.75 20h12.5A1.75 1.75 0 0 0 20 18.25V16.5"
                />
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
              placeholder={placeholder}
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300 sm:text-[15px]"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500 sm:text-sm">Supported: PDF, DOCX, TXT, images</p>

              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                type="button"
              >
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
  )
}
