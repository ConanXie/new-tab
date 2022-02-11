import React, { FC, ReactNode } from "react"

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { SxProps, Theme } from "@mui/material/styles"

import { toolbarStore, desktopSettings, desktopStore } from "../../../store"

export type Widget = {
  id: string
  name: string
  description: string
  sample: ReactNode
  columns: number
  rows: number
  minColumns: number
  maxColumns: number
  minRows: number
  maxRows: number
}

type WidgetCategory = {
  id: string
  name: string
  widgets: Widget[]
}

const widgetCategories: WidgetCategory[] = [
  {
    id: "1",
    name: "Date & Time",
    widgets: [
      {
        id: "clock-hour-minute-simple",
        name: "Text Clock",
        description: "Displays the current time",
        columns: 1,
        rows: 1,
        minColumns: 1,
        maxColumns: 3,
        minRows: 1,
        maxRows: 3,
        sample: (
          <svg
            width="38"
            height="63"
            viewBox="0 0 38 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8145 0.265625V26H7.5625V4.32617L1.00586 6.7168V3.78125L10.3047 0.265625H10.8145ZM37.1465 23.3281V26H20.3945V23.6621L28.7793 14.3281C29.8105 13.1797 30.6074 12.207 31.1699 11.4102C31.7441 10.6016 32.1426 9.88086 32.3652 9.24805C32.5996 8.60352 32.7168 7.94727 32.7168 7.2793C32.7168 6.43555 32.541 5.67383 32.1895 4.99414C31.8496 4.30273 31.3457 3.75195 30.6777 3.3418C30.0098 2.93164 29.2012 2.72656 28.252 2.72656C27.1152 2.72656 26.166 2.94922 25.4043 3.39453C24.6543 3.82813 24.0918 4.4375 23.7168 5.22266C23.3418 6.00781 23.1543 6.91016 23.1543 7.92969H19.9023C19.9023 6.48828 20.2188 5.16992 20.8516 3.97461C21.4844 2.7793 22.4219 1.83008 23.6641 1.12695C24.9062 0.412109 26.4355 0.0546875 28.252 0.0546875C29.8691 0.0546875 31.252 0.341797 32.4004 0.916016C33.5488 1.47852 34.4277 2.27539 35.0371 3.30664C35.6582 4.32617 35.9688 5.52148 35.9688 6.89258C35.9688 7.64258 35.8398 8.4043 35.582 9.17773C35.3359 9.93945 34.9902 10.7012 34.5449 11.4629C34.1113 12.2246 33.6016 12.9746 33.0156 13.7129C32.4414 14.4512 31.8262 15.1777 31.1699 15.8926L24.3145 23.3281H37.1465ZM16.1934 47.1641V51.0664C16.1934 53.1641 16.0059 54.9336 15.6309 56.375C15.2559 57.8164 14.7168 58.9766 14.0137 59.8555C13.3105 60.7344 12.4609 61.373 11.4648 61.7715C10.4805 62.1582 9.36719 62.3516 8.125 62.3516C7.14062 62.3516 6.23242 62.2285 5.40039 61.9824C4.56836 61.7363 3.81836 61.3438 3.15039 60.8047C2.49414 60.2539 1.93164 59.5391 1.46289 58.6602C0.994141 57.7812 0.636719 56.7148 0.390625 55.4609C0.144531 54.207 0.0214844 52.7422 0.0214844 51.0664V47.1641C0.0214844 45.0664 0.208984 43.3086 0.583984 41.8906C0.970703 40.4727 1.51562 39.3359 2.21875 38.4805C2.92188 37.6133 3.76562 36.9922 4.75 36.6172C5.74609 36.2422 6.85938 36.0547 8.08984 36.0547C9.08594 36.0547 10 36.1777 10.832 36.4238C11.6758 36.6582 12.4258 37.0391 13.082 37.5664C13.7383 38.082 14.2949 38.7734 14.752 39.6406C15.2207 40.4961 15.5781 41.5449 15.8242 42.7871C16.0703 44.0293 16.1934 45.4883 16.1934 47.1641ZM12.9238 51.5938V46.6191C12.9238 45.4707 12.8535 44.4629 12.7129 43.5957C12.584 42.7168 12.3906 41.9668 12.1328 41.3457C11.875 40.7246 11.5469 40.2207 11.1484 39.834C10.7617 39.4473 10.3105 39.166 9.79492 38.9902C9.29102 38.8027 8.72266 38.709 8.08984 38.709C7.31641 38.709 6.63086 38.8555 6.0332 39.1484C5.43555 39.4297 4.93164 39.8809 4.52148 40.502C4.12305 41.123 3.81836 41.9375 3.60742 42.9453C3.39648 43.9531 3.29102 45.1777 3.29102 46.6191V51.5938C3.29102 52.7422 3.35547 53.7559 3.48438 54.6348C3.625 55.5137 3.83008 56.2754 4.09961 56.9199C4.36914 57.5527 4.69727 58.0742 5.08398 58.4844C5.4707 58.8945 5.91602 59.1992 6.41992 59.3984C6.93555 59.5859 7.50391 59.6797 8.125 59.6797C8.92188 59.6797 9.61914 59.5273 10.2168 59.2227C10.8145 58.918 11.3125 58.4434 11.7109 57.7988C12.1211 57.1426 12.4258 56.3047 12.625 55.2852C12.8242 54.2539 12.9238 53.0234 12.9238 51.5938ZM23.6113 59.2754H23.9453C25.8203 59.2754 27.3438 59.0117 28.5156 58.4844C29.6875 57.957 30.5898 57.248 31.2227 56.3574C31.8555 55.4668 32.2891 54.4648 32.5234 53.3516C32.7578 52.2266 32.875 51.0723 32.875 49.8887V45.9688C32.875 44.8086 32.7402 43.7773 32.4707 42.875C32.2129 41.9727 31.8496 41.2168 31.3809 40.6074C30.9238 39.998 30.4023 39.5352 29.8164 39.2188C29.2305 38.9023 28.6094 38.7441 27.9531 38.7441C27.2031 38.7441 26.5293 38.8965 25.9316 39.2012C25.3457 39.4941 24.8477 39.9102 24.4375 40.4492C24.0391 40.9883 23.7344 41.6211 23.5234 42.3477C23.3125 43.0742 23.207 43.8652 23.207 44.7207C23.207 45.4824 23.3008 46.2207 23.4883 46.9355C23.6758 47.6504 23.9629 48.2949 24.3496 48.8691C24.7363 49.4434 25.2168 49.9004 25.791 50.2402C26.377 50.5684 27.0625 50.7324 27.8477 50.7324C28.5742 50.7324 29.2539 50.5918 29.8867 50.3105C30.5312 50.0176 31.0996 49.625 31.5918 49.1328C32.0957 48.6289 32.4941 48.0605 32.7871 47.4277C33.0918 46.7949 33.2676 46.1328 33.3145 45.4414H34.8613C34.8613 46.4141 34.668 47.375 34.2812 48.3242C33.9062 49.2617 33.3789 50.1172 32.6992 50.8906C32.0195 51.6641 31.2227 52.2852 30.3086 52.7539C29.3945 53.2109 28.3984 53.4395 27.3203 53.4395C26.0547 53.4395 24.959 53.1934 24.0332 52.7012C23.1074 52.209 22.3457 51.5527 21.748 50.7324C21.1621 49.9121 20.7227 48.998 20.4297 47.9902C20.1484 46.9707 20.0078 45.9395 20.0078 44.8965C20.0078 43.6777 20.1777 42.5352 20.5176 41.4688C20.8574 40.4023 21.3613 39.4648 22.0293 38.6562C22.6973 37.8359 23.5234 37.1973 24.5078 36.7402C25.5039 36.2832 26.6523 36.0547 27.9531 36.0547C29.418 36.0547 30.666 36.3477 31.6973 36.9336C32.7285 37.5195 33.5664 38.3047 34.2109 39.2891C34.8672 40.2734 35.3477 41.3809 35.6523 42.6113C35.957 43.8418 36.1094 45.1074 36.1094 46.4082V47.5859C36.1094 48.9102 36.0215 50.2578 35.8457 51.6289C35.6816 52.9883 35.3594 54.2891 34.8789 55.5312C34.4102 56.7734 33.7246 57.8867 32.8223 58.8711C31.9199 59.8438 30.7422 60.6172 29.2891 61.1914C27.8477 61.7539 26.0664 62.0352 23.9453 62.0352H23.6113V59.2754Z"
              fill="var(--accent1-100)"
            />
          </svg>
        ),
      },
      {
        id: "clock-scallop",
        name: "Scallop Clock",
        description: "Displays the current time",
        columns: 1,
        rows: 1,
        minColumns: 1,
        maxColumns: 3,
        minRows: 1,
        maxRows: 3,
        sample: (
          <Box
            sx={
              {
                "--color-scallop-dail": "var(--accent1-20)",
                "--color-scallop-date": "var(--neutral1-900)",
                "--color-scallop-hour": "var(--accent2-700)",
                "--color-scallop-minute": "var(--accent1-500)",
                "--color-scallop-second": "var(--accent3-600)",
                "@media (prefers-color-scheme: dark)": {
                  "--color-scallop-dail": "var(--accent2-800)",
                  "--color-scallop-date": "var(--neutral1-100)",
                  "--color-scallop-hour": "var(--accent1-400)",
                  "--color-scallop-minute": "var(--accent1-100)",
                  "--color-scallop-second": "var(--accent3-50)",
                },
              } as SxProps<Theme>
            }
          >
            <svg width="100px" viewBox="0 0 523 492" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M245.71 480.569a37.38 37.38 0 0031.667 0l35.884-16.781a37.396 37.396 0 0112.616-3.38l39.467-3.41a37.378 37.378 0 0027.424-15.833l22.686-32.474a37.384 37.384 0 019.236-9.236l32.474-22.686a37.381 37.381 0 0015.834-27.425l3.409-39.466a37.374 37.374 0 013.381-12.616l16.78-35.884a37.38 37.38 0 000-31.667l-16.78-35.884a37.38 37.38 0 01-3.381-12.616l-3.409-39.467a37.378 37.378 0 00-15.834-27.424L424.69 91.634a37.383 37.383 0 01-9.236-9.236l-22.686-32.474a37.378 37.378 0 00-27.424-15.834l-39.467-3.41a37.378 37.378 0 01-12.616-3.38l-35.884-16.78a37.378 37.378 0 00-31.667 0L209.826 27.3a37.378 37.378 0 01-12.616 3.38l-39.466 3.41a37.38 37.38 0 00-27.425 15.834l-22.686 32.474a37.387 37.387 0 01-9.236 9.236L65.923 114.32a37.377 37.377 0 00-15.833 27.424l-3.41 39.467a37.382 37.382 0 01-3.38 12.616l-16.78 35.884a37.378 37.378 0 000 31.667l16.78 35.884a37.374 37.374 0 013.38 12.616l3.41 39.466a37.38 37.38 0 0015.833 27.425l32.474 22.686a37.388 37.388 0 019.236 9.236l22.686 32.474a37.38 37.38 0 0027.425 15.833l39.466 3.41a37.396 37.396 0 0112.616 3.38l35.884 16.781z"
                fill="var(--color-scallop-dail)"
              />
              <rect
                x="149.727"
                y="211.373"
                width="34.788"
                height="131.147"
                rx="17.394"
                transform="rotate(-65 149.727 211.373)"
                fill="var(--color-scallop-hour)"
              />
              <rect
                x="244.607"
                y="227.057"
                width="34.788"
                height="172.292"
                rx="17.394"
                fill="var(--color-scallop-minute)"
              />
              <path
                d="M122.487 395.21c8.286 8.287 21.721 8.287 30.007 0 8.286-8.286 8.286-21.721 0-30.007-8.286-8.286-21.721-8.286-30.007 0-8.287 8.286-8.287 21.721 0 30.007z"
                fill="var(--color-scallop-second)"
              />
              <path
                d="M339.973 71.853l-9.254-4.22 2.15-4.719 23.54 10.748-2.15 4.718-9.201-4.194-12.661 27.734-5.059-2.307 12.635-27.76zm4.666 34.025c-.367-2.438.367-5.033 2.149-7.785l8.625-13.16 4.587 2.99-8.205 12.556c-1.127 1.73-1.573 3.303-1.337 4.719.236 1.415 1.049 2.595 2.438 3.486 1.127.734 2.333 1.101 3.591 1.101 1.259 0 2.438-.341 3.539-1.022 1.101-.656 2.019-1.573 2.779-2.7l7.471-11.43 4.535 2.963-13.893 21.259-4.273-2.805 1.887-2.883-.262-.158c-1.285.629-2.779.865-4.456.708a10.169 10.169 0 01-4.693-1.625c-2.621-1.704-4.115-3.775-4.482-6.213zm24.405 18.716c-.681-2.228-.734-4.456-.183-6.737.55-2.254 1.704-4.325 3.46-6.213a14.382 14.382 0 015.793-3.827c2.228-.76 4.457-.943 6.737-.498 2.281.446 4.299 1.494 6.108 3.172 1.913 1.756 3.172 3.696 3.801 5.793s.629 4.221.026 6.318c-.603 2.097-1.756 4.089-3.46 5.898a12.31 12.31 0 01-1.232 1.179l-14.601-13.578c-1.468 1.94-2.097 3.906-1.888 5.898.21 1.992 1.075 3.696 2.543 5.059 1.206 1.127 2.517 1.809 3.88 2.071a8.352 8.352 0 004.089-.236l1.835 4.64c-2.28.734-4.561.865-6.815.393-2.255-.446-4.378-1.625-6.37-3.486-1.783-1.678-3.041-3.644-3.723-5.846zm19.923-1.468c.576-.734.996-1.625 1.232-2.648.236-1.048.183-2.149-.158-3.302-.34-1.154-1.048-2.255-2.175-3.277-1.337-1.232-2.831-1.888-4.509-1.94-1.678-.052-3.303.419-4.902 1.442l10.512 9.725zm29.094 17.749l-6.501-2.386 1.809-4.639 11.534 4.22 2.228 3.198-27.996 19.398-3.119-4.482 22.045-15.309zm-11.005 29.228l13.291 2.255.078-.263c-.97-.681-1.756-1.625-2.333-2.804-.786-1.573-1.101-3.303-.97-5.217a11.248 11.248 0 011.757-5.347c1.048-1.652 2.516-2.963 4.377-3.88 1.861-.918 3.827-1.285 5.898-1.075 2.071.21 3.959.891 5.689 2.097a12.127 12.127 0 014.01 4.666c1.049 2.15 1.521 4.273 1.363 6.423-.157 2.123-.812 4.037-1.966 5.74a11.343 11.343 0 01-4.456 3.88 13.614 13.614 0 01-5.531 1.416c-1.94.078-4.22-.105-6.815-.499l-15.126-2.254.734-5.138zm18.035 1.023a6.436 6.436 0 003.172 1.179c1.153.105 2.281-.105 3.382-.655 1.101-.551 1.939-1.311 2.542-2.281a6.56 6.56 0 00.996-3.224 6.792 6.792 0 00-.707-3.355c-.525-1.075-1.259-1.94-2.228-2.595-.97-.682-2.019-1.075-3.146-1.18-1.127-.105-2.254.105-3.355.629-1.101.551-1.966 1.311-2.569 2.281-.629.996-.97 2.07-.997 3.224-.026 1.153.184 2.28.708 3.355a6.478 6.478 0 002.202 2.622z"
                fill="var(--color-scallop-date)"
              />
            </svg>
          </Box>
        ),
      },
    ],
  },
]

const WidgetList: FC = () => {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, widget: Widget) => {
    if (event.button !== 0) {
      return
    }

    event.persist()

    const el = event.currentTarget
    const { top, left, width, height } = el.getBoundingClientRect()
    const desktopEl = document.querySelector<HTMLElement>("#desktop")!
    const { clientWidth, clientHeight, offsetTop: desktopOffsetTop } = desktopEl
    const { screenX: downScreenX, screenY: downScreenY } = event
    let clone: HTMLElement

    const handleMouseMove = (evt: MouseEvent) => {
      const { screenX: moveScreenX, screenY: moveScreenY } = evt
      if (downScreenX !== moveScreenX || downScreenY !== moveScreenY) {
        event.preventDefault()
        evt.preventDefault()

        toolbarStore.closeDrawer()

        el.removeEventListener("mousemove", handleMouseMove)

        clone = el.cloneNode(true) as HTMLElement

        const offsetLeft = evt.clientX - left
        const offsetTop = evt.clientY - top

        const translateX = evt.clientX - offsetLeft
        const translateY = evt.clientY - offsetTop

        clone.style.transform = `translate(${translateX}px, ${translateY}px)`
        clone.style.position = "absolute"
        clone.style.top = "0"
        clone.style.left = "0"
        clone.style.zIndex = "9999"

        const handleMouseMoveOnDocument = (e: MouseEvent) => {
          e.preventDefault()
          const transX = e.clientX - offsetLeft
          const transY = e.clientY - offsetTop
          clone.style.transform = `translate(${transX}px, ${transY}px)`
        }
        document.addEventListener("mousemove", handleMouseMoveOnDocument)

        const handleMouseUpOnDoc = (e: MouseEvent) => {
          let restricted = true
          const x = e.clientX
          const y = e.clientY - desktopOffsetTop
          const columnSize = clientWidth / desktopSettings.columns
          const rowSize = clientHeight / desktopSettings.rows
          const column = Math.ceil(x / columnSize) - 1
          const row = Math.ceil(y / rowSize) - 1

          if (
            x > 0 &&
            x < clientWidth &&
            y > 0 &&
            y < clientHeight &&
            desktopStore.isAreaAvailable(
              row,
              column,
              row + widget.rows,
              column + widget.columns,
            )
          ) {
            restricted = false
            const transX = column * columnSize
            const transY = row * rowSize + desktopOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`
          }

          document.body.removeChild(clone)

          if (!restricted) {
            desktopStore.createWidget(widget, row + 1, column + 1)
          }

          document.removeEventListener("mousemove", handleMouseMoveOnDocument)
          document.removeEventListener("mouseup", handleMouseUpOnDoc)
        }

        document.addEventListener("mouseup", handleMouseUpOnDoc)

        document.body.appendChild(clone)
      }
    }

    el.addEventListener("mousemove", handleMouseMove)

    const handleMouseUpOnDocument = () => {
      el.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUpOnDocument)
    }
    document.addEventListener("mouseup", handleMouseUpOnDocument)
  }

  return (
    <Box
      sx={{
        padding: 2,
      }}
    >
      {widgetCategories.map((category) => {
        return (
          <Box key={category.id}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
              }}
            >
              {category.name}
            </Typography>
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {category.widgets.map((widget) => {
                return (
                  <Box
                    key={widget.id}
                    sx={{
                      position: "relative",
                      userSelect: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: 150,
                      height: 150,
                      pb: 1,
                      backgroundColor: "var(--neutral1-400)",
                      verticalAlign: "middle",
                      "&:not(:last-of-type)": {
                        mr: 2,
                      },
                    }}
                    onMouseDown={(event) => handleMouseDown(event, widget)}
                  >
                    <Box sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>{widget.sample}</Box>
                    <Typography variant="body2">{widget.name}</Typography>
                    <Typography variant="body2">
                      {widget.columns} × {widget.rows}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default WidgetList
