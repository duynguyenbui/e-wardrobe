import OpenAI from 'openai'

declare global {
  // eslint-disable-next-line no-var
  var embeddings: OpenAI | undefined
}

if (!global.embeddings) {
  if (!process.env.OPENAI_API_KEY_EMBEDDING || !process.env.OPENAI_BASE_URL_EMBEDDING) {
    global.embeddings = undefined
  } else {
    global.embeddings = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY_EMBEDDING!,
      baseURL: process.env.OPENAI_BASE_URL_EMBEDDING!,
    })
  }
}

export const embeddings = global.embeddings
