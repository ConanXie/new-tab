/** Validate base64 data */
export const isBase64 = (text: string): boolean => /^data:image\/\w+;base64/.test(text)
