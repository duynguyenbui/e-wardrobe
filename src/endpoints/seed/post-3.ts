import type { Post } from '@/payload-types'

export const post3: Partial<Post> = {
  slug: 'dong-dong-la-va-su-nhan-thuc-du-bao-tai-chinh',
  _status: 'published',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  content: {
    root: {
      type: 'root',
      children: [
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
                        text: 'Tuyên bố từ chối trách nhiệm: ',
                        version: 1,
                      },
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Nội dung này được tạo ra và chỉ dành cho mục đích minh họa. Để chỉnh sửa bài viết này, ',
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
              text: 'Tiền không chỉ là tiền tệ; ',
              version: 1,
            },
            {
              type: 'text',
              detail: 0,
              format: 2,
              mode: 'normal',
              style: '',
              text: 'nó là một ngôn ngữ. ',
              version: 1,
            },
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Khám phá sâu vào những sắc thái của nó, nơi chiến lược gặp gỡ trực giác trong biển tài chính rộng lớn.',
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
              text: 'Tiền, trong bản chất của nó, vượt qua khái niệm đơn thuần về đồng xu và tờ giấy; nó trở thành một ngôn ngữ sâu sắc nói về giá trị, niềm tin và cấu trúc xã hội. Giống như bất kỳ ngôn ngữ nào, nó có những sắc thái và tinh tế phức tạp đòi hỏi sự hiểu biết tinh tường. Chính trong những độ sâu này, thế giới tính toán của chiến lược tài chính va chạm với bản chất thô sơ, bản năng của trực giác con người. Giống như một nhà ngôn ngữ học dày dạn có thể phân tích cú pháp và ngữ nghĩa của một câu, một chuyên gia tài chính điều hướng đại dương tài chính rộng lớn và đầy biến động, được dẫn dắt không chỉ bởi logic và dữ liệu mà còn bởi cảm giác và tầm nhìn. Mỗi giao dịch, đầu tư và quyết định tài chính trở thành một cuộc đối thoại trong từ vựng rộng lớn này của thương mại và giá trị.',
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
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Động lực Thị trường Chứng khoán: Bò, Gấu và Trung gian Không chắc chắn',
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
              text: 'Thị trường chứng khoán là một lĩnh vực có cơ hội lớn nhưng cũng tiềm ẩn rủi ro. Khám phá các lực lượng thúc đẩy xu hướng thị trường và các chiến lược được các nhà giao dịch hàng đầu sử dụng để điều hướng hệ sinh thái phức tạp này. Từ phân tích thị trường đến hiểu tâm lý nhà đầu tư, có được cái nhìn toàn diện về thế giới cổ phiếu.',
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
              text: 'Thị trường chứng khoán, thường được hình dung như một đấu trường nhộn nhịp của các con số và băng chuyền, cũng liên quan đến hành vi con người nhiều như kinh tế học. Đó là nơi mà sự lạc quan, được đại diện bởi sự tăng giá của thị trường, gặp gỡ sự thận trọng của sự suy giảm, với mỗi bên cố gắng định hướng thị trường. Nhưng giữa hai cực này là một vùng trung gian không chắc chắn, một khu vực được lấp đầy bởi các nhà giao dịch và nhà đầu tư luôn cân nhắc giữa hy vọng và sợ hãi. Điều hướng thành công đòi hỏi không chỉ sự hiểu biết về tài chính mà còn đòi hỏi sự hiểu biết về tình cảm tập thể và khả năng dự đoán không chỉ các chuyển động của thị trường mà còn cả phản ứng của các thành viên khác trong thị trường. Trong điệu nhảy phức tạp của các con số và thần kinh này, những người chơi tinh tế nhất là những người làm chủ cả dữ liệu cứng và những sắc thái mềm của hành vi con người.',
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
            blockName: 'Thành phần động',
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
    description: `Tiền không chỉ là tiền tệ; nó là một ngôn ngữ. Khám phá sâu vào những sắc thái của nó, nơi chiến lược gặp gỡ trực giác trong biển tài chính rộng lớn.`,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    image: '{{IMAGE_1}}',
    title: 'Đồng Đô La và Sự Nhận Thức: Dự Báo Tài Chính',
  },
  relatedPosts: [], // this is populated by the seed script
  title: 'Đồng Đô La và Sự Nhận Thức: Dự Báo Tài Chính',
}
