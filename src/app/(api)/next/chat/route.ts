import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { getProductVariants } from '@/actions/productVariants'
import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL_COMPLETION!,
    apiKey: process.env.OPENAI_API_KEY_COMPLETION!,
  })

  const { user } = await getServerSideUser()
  const payload = await getPayloadClient()

  if (!user) {
    return new Response('Bạn cần đăng nhập để sử dụng chức năng này', { status: 401 })
  }

  const { docs: convversations } = await payload.find({
    collection: 'conversation',
    where: {
      user: {
        equals: user?.id,
      },
    },
    limit: 1,
    depth: 1,
    pagination: false,
  })

  let conversation = convversations[0]

  if (!conversation && user) {
    conversation = await payload.create({
      collection: 'conversation',
      data: {
        user: user,
        messages: [],
      },
    })
  }

  const payloadMessages: any = messages
    .filter((message) => {
      return message.role === 'assistant' || message.role === 'user'
    })
    .map((message) => {
      return {
        role: message.role,
        content: message.content || '',
      }
    })

  if (conversation?.id && payloadMessages.length > 0) {
    await payload.update({
      collection: 'conversation',
      id: conversation.id,
      data: { messages: [...payloadMessages] },
    })
  }

  const coreMessages: CoreMessage[] = []
  const productVariants = await getProductVariants()

  productVariants.forEach((productVariant) => {
    const content = `{
      "Tên": "${productVariant.title}",
      "Mô tả": "${productVariant.description || ''}",
      "Giá": ${productVariant.price},
      "Khuyến mãi": ${productVariant.discount},
      "Kích cỡ": "${(productVariant.size as any)?.name || ''}",
      "Màu": "${(productVariant.color as any)?.title || ''}",
      "Sản phẩm": "${(productVariant.product as any)?.title || ''}",
      "Chất liệu": "${(productVariant.product as any)?.material?.title || ''}",
      "Link": "${process.env.NEXT_PUBLIC_SERVER_URL}/products/${(productVariant.product as any)?.id || ''}"
      "ID": "${(productVariant.product as any)?.id}",
    }`

    coreMessages.push({
      role: 'system',
      content: `:::DATA::: Thông tin sản phẩm: ${content}`,
    })
  })

  coreMessages.push({
    role: 'system',
    content: `Bạn là một nhân viên bán hàng của cửa hàng online. Bạn có thể trả lời các câu hỏi của khách hàng về sản phẩm và dịch vụ của cửa hàng. Dựa trên data trên đây, bạn có thể trả lời các câu hỏi của khách hàng:`,
  })

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL_COMPLETION!),
    messages: [...coreMessages, ...messages],
  })

  return result.toDataStreamResponse()
}
