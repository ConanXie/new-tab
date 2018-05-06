/**
 * Convert base64 to blob and return blob URL
 * @param data base64 data
 * @param type content type
 * @param sliceSize default 512
 */
export function base64toBlobURL(data: string, type: string = "", sliceSize: number = 512) {
  const byteCharacters = atob(data)
  const byteArrays = []
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type })
  return URL.createObjectURL(blob)
}

/**
 * Convert file or blob to base64
 * @param data File or Blob object
 */
export function toBase64(data: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(data)
  })
}
