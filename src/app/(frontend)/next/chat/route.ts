import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL_COMPLETION!,
    apiKey: process.env.OPENAI_API_KEY_COMPLETION!,
  })

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL_COMPLETION!),
    system:
      'You are a helpful assistant for a big-size clothing shop (eWardrobe). Provide friendly and informative responses about our clothing lines, sizes, fit, and style advice for plus-size customers.',
    messages,
  })

  return result.toDataStreamResponse()
}
