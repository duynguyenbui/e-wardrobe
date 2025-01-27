'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send } from 'lucide-react'
import { searchProductRelevance } from '@/actions/products'
import Link from 'next/link'

interface Message {
  text: string
  isUser: boolean
  products?: Array<{ id: string; title: string }>
}

export function EmbeddingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I assist you today?', isUser: false },
  ])
  const [inputValue, setInputValue] = useState('')

  const toggleChat = () => setIsOpen(!isOpen)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isUser: true }])
      setInputValue('')

      const { success, data, message } = await searchProductRelevance(inputValue)

      if (!success || !data) {
        setMessages((msgs) => [...msgs, { text: message, isUser: false }])
        return
      }

      setMessages((msgs) => [...msgs, { text: message, isUser: false, products: data }])
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-96 h-[500px] flex flex-col overflow-hidden">
          <div className="p-4 flex justify-between items-center bg-primary text-primary-foreground">
            <h3 className="font-semibold text-lg">Chat Support</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.products && (
                    <ul className="mt-2 space-y-1">
                      {msg.products.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/products/${product.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {product.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
          <form
            onSubmit={sendMessage}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow rounded-md"
              />
              <Button type="submit" size="icon">
                <Send className="size-5" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
