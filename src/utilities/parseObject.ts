/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseObject(object: any) {
  if (typeof object === 'object') {
    return object
  }
  return null
}
