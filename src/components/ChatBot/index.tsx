'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send, StopCircle } from 'lucide-react'
import { uuidv4 } from '@/utilities/uuid'
import { useChat } from 'ai/react'
import { Message } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { getProductVariants } from '@/actions/productVariants'

const initialMessages: Message[] = [
  {
    id: uuidv4(),
    role: 'system',
    content: 'Luôn sử dụng tiếng việt cho câu trả lời, bạn cần trả lời ngắn gọn',
  },
  {
    id: uuidv4(),
    role: 'system',
    content:
      'Bạn là trợ lý của eWardrobe, hãy giúp khách hàng tư vấn quần áo của họ dựa trên data của bạn có sẵn (gồm size, chất liệu, danh mục)',
  },
  {
    id: uuidv4(),
    role: 'user',
    content: 'Khách hàng tạo một cuộc trò chuyện mới',
  },
  {
    id: uuidv4(),
    role: 'assistant',
    content: 'eWardrobe là một ứng dụng giúp bạn quản lý tủ đồ của mình (Big Size).',
  },
]

export function ChatBot() {
  const [currentConversationID, setCurrentConversationID] = useState<string>(uuidv4())
  const { messages, input, setInput, append, setMessages, stop } = useChat({
    api: '/next/chat',
    initialMessages: initialMessages,
  })

  const handleNewConversation = () => {
    const uuid = uuidv4()
    setCurrentConversationID(uuid)
    setMessages([
      ...initialMessages,
      { id: uuid, role: 'user', content: 'Khách hàng tạo lại một cuộc trò chuyện mới' },
    ])
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      void append({ content: input, role: 'user' })
      setInput('')
    }
  }

  return (
    <div className="flex h-[80vh] container mb-4">
      {/* Danh sách cuộc hội thoại bên trái */}
      <div className="w-64 h-96 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Lựa chọn</h2>
        <Button
          variant="secondary"
          className="w-full justify-start mb-2"
          onClick={handleNewConversation}
        >
          Cuộc trò truyện mới
        </Button>
      </div>

      {/* Giao diện trò chuyện bên phải */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span>#{currentConversationID}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <Card
                className={`p-4 max-w-[80%] ${message.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-900'}`}
              >
                <div
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${message.role === 'user' ? 'bg-blue-500 dark:bg-blue-500' : 'bg-green-500 dark:bg-green-500'}`}
                  >
                    {message.role === 'user' ? 'U' : 'EW'}
                  </div>
                  <div className="flex-1">
                    <div className="flex-1">
                      <ReactMarkdown>
                        {message.content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
              <Input
                ref={inputRef}
                className="w-full"
                placeholder="Nhập câu hỏi của bạn ở đây..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <Button variant="destructive" size="icon" onClick={stop}>
                  <StopCircle className="h-4 w-4" />
                </Button>
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
