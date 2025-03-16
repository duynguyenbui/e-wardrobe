import type { Post } from '@/payload-types'

export const post2: Partial<Post> = {
  slug: 'nhin-toan-the-gioi',
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
              text: 'Khám phá những điều chưa kể và bị bỏ qua. Một cái nhìn phóng đại vào các góc của thế giới, nơi mỗi câu chuyện đều xứng đáng được chú ý.',
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
                            text: 'điều hướng đến bảng điều khiển quản trị.',
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
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 1,
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
              text: 'Sức mạnh của sự kiên cường: Những câu chuyện về sự phục hồi và hy vọng',
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
              text: "Trong suốt lịch sử, các khu vực trên toàn cầu đã phải đối mặt với tác động tàn phá của thiên tai, sự bất ổn chính trị và những biến động kinh tế. Trong những khoảnh khắc khủng hoảng sâu sắc này, một lực lượng thường bị đánh giá thấp xuất hiện: sự kiên cường không thể khuất phục của tinh thần con người. Đây không chỉ là những câu chuyện về sự sống sót đơn thuần, mà là những câu chuyện về các cộng đồng tạo dựng mối quan hệ, đoàn kết với mục đích chung và thể hiện khả năng vượt qua bẩm sinh.",
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
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Từ những người hàng xóm thành lập các đội cứu hộ tạm thời trong các trận lụt đến toàn bộ thành phố tập hợp lại để tái thiết sau sự sụp đổ kinh tế, bản chất của nhân loại được thể hiện rõ nhất trong những hành động đoàn kết này. Khi chúng ta đi sâu vào những câu chuyện này, chúng ta chứng kiến sức mạnh biến đổi của tinh thần cộng đồng, nơi nghịch cảnh trở thành chất xúc tác cho sự phát triển, đoàn kết và một tương lai tươi sáng hơn, được tái thiết.',
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
            blockName: 'Các thành phần động',
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
                        text: "Nội dung trên hoàn toàn động bằng cách sử dụng các khối xây dựng bố cục tùy chỉnh được cấu hình trong CMS. Điều này có thể là bất cứ điều gì bạn muốn từ văn bản phong phú và hình ảnh, đến các thành phần phức tạp, được thiết kế cao.",
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
      'Khám phá những điều chưa kể và bị bỏ qua. Một cái nhìn phóng đại vào các góc của thế giới, nơi mỗi câu chuyện đều xứng đáng được chú ý.',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    image: '{{IMAGE_1}}',
    title: 'Chân Trời Số: Một Cái Nhìn Về Tương Lai',
  },
  relatedPosts: [], // this is populated by the seed script
  title: 'Chân Trời Số: Một Cái Nhìn Về Tương Lai',
}
