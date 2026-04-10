export type Message = {
  id: string
  role: 'assistant' | 'user'
  content: string
  time: string
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
}
