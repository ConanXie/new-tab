import { WallpaperStore, defaultWallpaperData } from "./wallpaper"

describe("wallpaper store", () => {

  let store: WallpaperStore
  beforeEach(() => {
    store = new WallpaperStore({})
  })

  it("should use default value", () => {
    expect(store.color).toBe(defaultWallpaperData.color)
  })

  it("should return backgound-image css", () => {
    const property = "backgroundImage"
    store.wallpaper = "a.png"
    const css = store.wallpaperStyles
    expect(css).not.toEqual({})
    expect(css[property]).toBe(`url(${store.wallpaper})`)
  })

  it("should return backgound-color css", () => {
    const property = "backgroundColor"
    store.wallpaperType = 2
    const css = store.wallpaperStyles
    expect(css).not.toEqual({})
    expect(css[property]).toBe(defaultWallpaperData.color)
  })

  it("should return empty css", () => {
    store.useWallpaper = false
    const css = store.wallpaperStyles
    expect(css).toEqual({})
  })

  it("should disabled options", () => {
    store.useWallpaper = false
    expect(store.disabledImage).toBe(true)
    expect(store.disabledColor).toBe(true)
  })

  it("should disabled image options", () => {
    store.wallpaperType = 2
    expect(store.disabledImage).toBe(true)
    expect(store.disabledColor).toBe(false)
  })

  it("should disabled color options", () => {
    expect(store.disabledImage).toBe(false)
    expect(store.disabledColor).toBe(true)
  })

  it("should update wallpaper", () => {
    const url = "a.png"
    store.wallpaperUpdated(url)
    expect(store.wallpaperType).toBe(1)
    expect(store.wallpaper).toBe(url)
  })
})
