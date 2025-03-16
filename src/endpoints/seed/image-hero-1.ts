import type { Media } from '@/payload-types'

export const imageHero1: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Hình dạng kim loại thẳng với gradient màu xanh lam',
}
