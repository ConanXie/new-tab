import React, { FC, useCallback } from "react"

import { Theme } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Tooltip from "@mui/material/Tooltip"
import Snackbar from "@mui/material/Snackbar"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import AutorenewIcon from "@mui/icons-material/AutorenewOutlined"
import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternateOutlined"
import DashboardIcon from "@mui/icons-material/DashboardOutlined"
import CropIcon from "@mui/icons-material/CropOutlined"

import { imageRe, imageSize } from "config"
import { sendMessage } from "utils/message"
import { isBase64 } from "utils/validate"
import Box from "@mui/material/Box"
import { SystemStyleObject } from "@mui/system/styleFunctionSx"

const SIZE = 192
const ACTUAL_SIZE = 174

const cropperIcons: (theme: Theme) => SystemStyleObject<Theme> = () => ({
  position: "absolute",
  cursor: "pointer",
  color: "#fff",
  opacity: 0.8,
  "&:active": {
    opacity: 1,
  },
})

enum IconType {
  BuiltIn = "1",
  Custom = "2",
}

interface Props {
  url: string
  icon?: string
  open: boolean
  onClose: (icon?: string) => void
}

const ShortcutIcon: FC<Props> = (props) => {
  const { open, icon, url } = props
  const [type, setType] = React.useState(IconType.BuiltIn)
  const [icons, setIcons] = React.useState([] as string[])
  const [selectedIcon, setSelectedIcon] = React.useState("")
  const [image, setImage] = React.useState(null as HTMLImageElement | null)

  const handleClose = () => {
    props.onClose()
  }

  const handleTypeChange = (event: React.MouseEvent, value: IconType | null) => {
    if (value) {
      setType(value)
    }
  }

  React.useEffect(() => {
    // Sync state
    if (open) {
      sendMessage("getIcons", url, (builtInIcons: string[]) => {
        setIcons(builtInIcons)
      })
      if (icon && isBase64(icon)) {
        setType(IconType.Custom)
        const img = new Image()
        img.src = icon
        img.onload = () => setImage(img)
      } else {
        setType(IconType.BuiltIn)
        setSelectedIcon(icon || "")
      }
    } else {
      setImage(null)
      setSelectedIcon("")
    }
  }, [open, icon, url])

  const preventImgDrag = (event: React.MouseEvent) => event.preventDefault()

  let startX: number
  let startY: number
  const cropEl: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null)
  const [crop, setCrop] = React.useState({
    x: 0,
    y: 0,
    scale: 1,
  })

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const step = 0.1
    const direction = event.deltaY < 0 ? 1 : -1
    const scale = crop.scale * (1 + direction * step)
    if (!image || image.width * scale < 10) {
      return
    }
    let { offsetX, offsetY } = event
    // Zoom from center
    if (event.altKey) {
      offsetX = offsetY = SIZE / 2
    }
    setCrop({
      x: crop.x - (offsetX - crop.x) * step * direction,
      y: crop.y - (offsetY - crop.y) * step * direction,
      scale,
    })
  }

  const handleMouseMove = (event: MouseEvent) => {
    setCrop({
      ...crop,
      x: crop.x + (event.pageX - startX),
      y: crop.y + (event.pageY - startY),
    })
  }

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) {
      startX = event.pageX
      startY = event.pageY
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Passive wheel event can't be prevented if bound on React Element
  React.useEffect(() => {
    let element: HTMLDivElement
    setTimeout(() => {
      if (cropEl.current) {
        element = cropEl.current
        element.addEventListener("wheel", handleWheel)
      }
    }, 0)
    return () => {
      setTimeout(() => {
        if (element) {
          element.removeEventListener("wheel", handleWheel)
        }
      }, 0)
    }
  })

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
  })

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false })

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      // Clear input value
      event.target.value = ""
      if (file) {
        const { type: fileType, size } = file
        const matched = imageRe.test(fileType)
        if (!matched) {
          setSnackbar({
            open: true,
            message: chrome.i18n.getMessage("desktop_msg_not_supported"),
          })
          return
        }
        if (size > imageSize) {
          setSnackbar({
            open: true,
            message: chrome.i18n.getMessage("desktop_msg_too_large"),
          })
          return
        }
        const src = URL.createObjectURL(file)
        const img = new Image()
        img.src = src
        img.onload = () => setImage(img)
      }
    }
  }

  const resetImage = useCallback(() => {
    if (!image) {
      return
    }
    const { width, height } = image
    if (width <= 0 || height <= 0) {
      return
    }
    let x
    let y
    let scale
    if (width > height) {
      y = 0
      scale = SIZE / height
      x = (SIZE - width * scale) / 2
    } else {
      x = 0
      scale = SIZE / width
      y = (SIZE - height * scale) / 2
    }
    setCrop({
      x,
      y,
      scale,
    })
  }, [image])

  React.useEffect(() => {
    resetImage()
    return () => {
      if (image && /^blob/.test(image.src)) {
        URL.revokeObjectURL(image.src)
      }
    }
  }, [image, open, resetImage])

  const handleDone = () => {
    if (type === IconType.BuiltIn && selectedIcon) {
      props.onClose(selectedIcon)
    } else if (type === IconType.Custom && image) {
      const canvas = document.createElement("canvas")
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext("2d")!
      ctx.save()
      ctx.arc(SIZE / 2, SIZE / 2, ACTUAL_SIZE / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(image, crop.x, crop.y, image.width * crop.scale, image.height * crop.scale)
      props.onClose(canvas.toDataURL("image/png"))
    } else {
      props.onClose()
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: 374,
            minHeight: 450,
          },
        }}
      >
        <DialogTitle>Icon Editor</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              marginBottom: 2,
            }}
          >
            <ToggleButtonGroup size="small" value={type} exclusive onChange={handleTypeChange}>
              <ToggleButton value={IconType.BuiltIn}>
                <Tooltip enterDelay={500} title="Built-in">
                  <DashboardIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={IconType.Custom}>
                <Tooltip enterDelay={500} title="Custom">
                  <CropIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {type === IconType.BuiltIn && (
            <Box
              sx={{
                margin: -1,
              }}
            >
              {icons.map((item) => {
                return (
                  <Box
                    component="img"
                    key={item}
                    src={chrome.runtime.getURL(`icons/${item}.png`)}
                    alt={item}
                    onClick={() => setSelectedIcon(item)}
                    sx={{
                      width: SIZE / 2,
                      height: SIZE / 2,
                      margin: 1,
                      borderRadius: 4,
                      border: "1px solid transparent",
                      cursor: "pointer",
                      borderColor: selectedIcon === item ? "primary.main" : null,
                    }}
                  />
                )
              })}
            </Box>
          )}
          {type === IconType.Custom && (
            <>
              <Box
                onMouseDown={handleMouseDown}
                ref={cropEl}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  width: SIZE,
                  height: SIZE,
                  userSelect: "none",
                  contain: "strict",
                  // tslint:disable-next-line: max-line-length
                  background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".047"/></svg>')`,
                  backgroundSize: "20px 20px",
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: SIZE - 2,
                    height: SIZE - 2,
                    transform: "translate(-50%, -50%)",
                    border: "1px dashed rgba(255, 255, 255, 0.6)",
                    borderRadius: "50%",
                  },
                  "& > img": {
                    position: "absolute",
                  },
                }}
              >
                {image && (
                  <img
                    style={{
                      top: crop.y + "px",
                      left: crop.x + "px",
                      width: image.width * crop.scale + "px",
                      height: image.height * crop.scale + "px",
                    }}
                    onMouseDown={preventImgDrag}
                    src={image.src}
                    alt=""
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: ACTUAL_SIZE,
                    height: ACTUAL_SIZE,
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 9999em rgba(0, 0, 0, 0.5)",
                  }}
                />
                <Tooltip enterDelay={500} title={chrome.i18n.getMessage("website_edit_icon_reset")}>
                  <AutorenewIcon
                    onClick={resetImage}
                    sx={[
                      cropperIcons,
                      {
                        left: 2,
                        top: 2,
                      },
                    ]}
                  />
                </Tooltip>
                <Tooltip enterDelay={500} title={chrome.i18n.getMessage("website_edit_icon_help")}>
                  <HelpIcon
                    sx={[
                      cropperIcons,
                      {
                        right: 2,
                        top: 2,
                      },
                    ]}
                  />
                </Tooltip>
              </Box>
              <input
                accept="image/*"
                id="select-image"
                type="file"
                style={{ display: "none" }}
                onChange={selectImage}
              />
              <label htmlFor="select-image">
                <Button
                  variant="outlined"
                  size="small"
                  component="span"
                  sx={{
                    marginTop: 1,
                    marginRight: 1,
                  }}
                >
                  <AddPhotoIcon />
                  {chrome.i18n.getMessage("website_edit_icon_select_file")}
                </Button>
              </label>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            {chrome.i18n.getMessage("button_cancel")}
          </Button>
          <Button color="primary" onClick={handleDone}>
            {chrome.i18n.getMessage("button_done")}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        autoHideDuration={2000}
        message={snackbar.message}
      />
    </>
  )
}

export default ShortcutIcon
