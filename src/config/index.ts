/**
 * Configure for the program
 */

export const websitesMax = 100

export const searchEnginesMax = 30

export const imageAccepts: string[] = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

export const imageRe = new RegExp(`^${imageAccepts.join("|")}$`)

export const imageSize = 10485760 // 10MB
