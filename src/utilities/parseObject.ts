export function parseObject(object: any) {
  if (typeof object === 'object') {
    return object
  }
  return null
}
