import type { Post } from '@/payload-types'

export const post1: Partial<Post> = {
  slug: 'chieu-kien-so',
  _status: 'published',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  content: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Khám phá những điều kỳ diệu của sự đổi mới hiện đại, nơi duy nhất không thay đổi là sự thay đổi. Một hành trình nơi các điểm ảnh và dữ liệu hội tụ để tạo nên tương lai.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Tuyên bố từ chối trách nhiệm',
            blockType: 'banner',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 1,
                        mode: 'normal',
                        style: '',
                        text: 'Tuyên bố từ chối trách nhiệm:',
                        version: 1,
                      },
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: ' Nội dung này được tạo ra và chỉ dành cho mục đích minh họa. Để chỉnh sửa bài viết này, ',
                        version: 1,
                      },
                      {
                        type: 'link',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'điều hướng đến bảng điều khiển quản trị',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        fields: {
                          linkType: 'custom',
                          newTab: true,
                          url: '/admin',
                        },
                        format: '',
                        indent: 0,
                        version: 3,
                      },
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            style: 'info',
          },
          format: '',
          version: 2,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Sự Trỗi Dậy của AI và Học Máy',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Chúng ta đang sống trong một thời đại chuyển đổi, nơi trí tuệ nhân tạo (AI) đứng ở vị trí tiên phong của sự tiến hóa công nghệ. Những tác động lan tỏa của những tiến bộ này đang định hình lại các ngành công nghiệp với tốc độ chưa từng có. Không còn là những quy trình thủ công tẻ nhạt, các doanh nghiệp giờ đây được hỗ trợ bởi những cỗ máy tinh vi, được cung cấp bởi lượng dữ liệu lịch sử khổng lồ, có khả năng đưa ra quyết định mà trước đây chỉ có con người mới có thể làm được. Những hệ thống thông minh này không chỉ tối ưu hóa hoạt động mà còn tiên phong trong các phương pháp sáng tạo, mở ra một kỷ nguyên mới của sự chuyển đổi kinh doanh trên toàn thế giới.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Để minh họa chức năng cơ bản của AI, đây là một đoạn mã javascript thực hiện yêu cầu POST đến một API AI chung để tạo văn bản dựa trên một gợi ý.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h4',
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Tạo Văn Bản',
            blockType: 'code',
            code: "async function generateText(prompt) {\n    const apiKey = 'your-api-key';\n    const apiUrl = 'https://api.example.com/generate-text';\n\n    const response = await fetch(apiUrl, {\n        method: 'POST',\n        headers: {\n            'Content-Type': 'application/json',\n            'Authorization': `Bearer ${apiKey}`\n        },\n        body: JSON.stringify({\n            model: 'text-generation-model',\n            prompt: prompt,\n            max_tokens: 50\n        })\n    });\n\n    const data = await response.json();\n    console.log(data.choices[0].text.trim());\n}\n\n// Example usage\ngenerateText(\"Ngày xửa ngày xưa ở một vùng đất xa xôi,\");\n",
            language: 'javascript',
          },
          format: '',
          version: 2,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'IoT: Kết Nối Thế Giới Xung Quanh Chúng Ta',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Trong bối cảnh công nghệ đang phát triển nhanh chóng ngày nay, Internet of Things (IoT) nổi bật như một lực lượng cách mạng. Từ việc biến đổi nơi ở của chúng ta với các hệ thống nhà thông minh đến việc định nghĩa lại giao thông qua các xe kết nối, ảnh hưởng của IoT là rõ ràng trong hầu hết mọi khía cạnh của cuộc sống hàng ngày của chúng ta.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Công nghệ này dựa trên sự tích hợp liền mạch của các thiết bị và hệ thống, cho phép chúng giao tiếp và hợp tác một cách dễ dàng. Với mỗi thiết bị kết nối, chúng ta tiến gần hơn đến một thế giới nơi sự tiện lợi và hiệu quả được tích hợp vào chính cấu trúc của sự tồn tại của chúng ta. Kết quả là, chúng ta đang chuyển sang một kỷ nguyên mà môi trường xung quanh chúng ta phản ứng một cách trực quan với nhu cầu của chúng ta, mở ra một cộng đồng toàn cầu thông minh và kết nối hơn.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: '',
            blockType: 'mediaBlock',
            media: '{{IMAGE_2}}',
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Các Thành Phần Động',
            blockType: 'banner',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Nội dung trên hoàn toàn động bằng cách sử dụng các khối xây dựng bố cục tùy chỉnh được cấu hình trong CMS. Điều này có thể là bất cứ điều gì bạn muốn từ văn bản phong phú và hình ảnh, đến các thành phần phức tạp, được thiết kế cao.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            style: 'info',
          },
          format: '',
          version: 2,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  heroImage: '{{IMAGE_1}}',
  meta: {
    description:
      'Khám phá những điều kỳ diệu của sự đổi mới hiện đại, nơi duy nhất không thay đổi là sự thay đổi. Một hành trình nơi các điểm ảnh và dữ liệu hội tụ để tạo nên tương lai.',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    image: '{{IMAGE_1}}',
    title: 'Chân Trời Số: Một Cái Nhìn Về Tương Lai',
  },
  relatedPosts: [], // this is populated by the seed script
  title: 'Chân Trời Số: Một Cái Nhìn Về Tương Lai',
}
