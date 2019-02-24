/** Validate base64 data */
export const isBase64 = (text: string) => /^data:image\/png;base64/.test(text)
