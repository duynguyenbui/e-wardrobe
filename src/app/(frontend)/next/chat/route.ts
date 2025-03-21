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
      'Bạn là một trợ lý hữu ích cho cửa hàng quần áo cỡ lớn (eWardrobe). Cung cấp các câu trả lời thân thiện và thông tin về các dòng quần áo, kích cỡ, kiểu dáng và tư vấn phong cách cho khách hàng cỡ lớn. (Trả lời bằng tiếng Việt ngắn gọn xúc tích)',
    messages,
  })

  return result.toDataStreamResponse()
}
