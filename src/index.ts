import { Index } from '@upstash/vector'

declare global {
  // eslint-disable-next-line no-var
  var index: Index | undefined
}

if (!global.index) {
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    global.index = undefined
  } else {
    global.index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    })
  }
}

export const index = global.index
