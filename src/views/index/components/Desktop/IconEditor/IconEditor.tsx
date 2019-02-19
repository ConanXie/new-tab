import * as React from "react"
import * as classNames from "classnames"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
// import Typography from "@material-ui/core/Typography"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormHelperText from "@material-ui/core/FormHelperText"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
// import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import Snackbar from "@material-ui/core/Snackbar"
import AutorenewIcon from "@material-ui/icons/AutorenewOutlined"
import HelpIcon from "@material-ui/icons/HelpOutlineOutlined"
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternateOutlined"

import { imageAccepts, imageSize } from "config"

const SIZE = 192
const ACTUAL_SIZE = 174

const styles = (theme: Theme) => createStyles({
  cropperContainer: {
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
  },
  cropper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: ACTUAL_SIZE,
    height: ACTUAL_SIZE,
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    boxShadow: "0 0 0 9999em rgba(0, 0, 0, 0.5)",
  },
  cropperIcons: {
    position: "absolute",
    cursor: "pointer",
    color: "#fff",
    opacity: 0.8,
    "&:active": {
      opacity: 1,
    },
  },
  resetIcon: {
    left: 2,
    top: 2,
  },
  helpIcon: {
    right: 2,
    top: 2,
  },
  addPhotoIcon: {
    marginRight: theme.spacing.unit,
  },
  input: {
    display: "none",
  },
})

enum IconType {
  Official = "1",
  Custom = "2",
}

interface Props extends WithStyles<typeof styles> {
  icon: string
  open: boolean
  onClose: (event?: React.SyntheticEvent<{}>) => void
}

function ShortcutIcon(props: Props) {
  const { open, icon, classes } = props

  const [type, setType] = React.useState(IconType.Custom)

  const handleClose = (event: React.SyntheticEvent<{}>) => {
    props.onClose(event)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value as IconType)
    console.log(icon)
  }

  const preventImgDrag = (event: React.MouseEvent) => event.preventDefault()

  let startX: number
  let startY: number
  const cropEl = React.useRef(null)
  const [crop, setCrop] = React.useState({
    x: 0,
    y: 0,
    scale: 1,
  })
  const [image, setImage] = React.useState(null as HTMLImageElement | null)

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const step = 0.1
    const direction = event.deltaY < 0 ? 1 : -1
    const scale = crop.scale * (1 + direction * step)
    if (scale < 0.1) {
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

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) {
      startX = event.pageX
      startY = event.pageY
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    setCrop({
      ...crop,
      x: crop.x + (event.pageX - startX),
      y: crop.y + (event.pageY - startY),
    })
  }

  const handleMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  // Passive wheel event can't be prevented if bound on React Element
  React.useEffect(() => {
    setTimeout(() => {
      if (cropEl.current) {
        (cropEl.current! as HTMLDivElement).addEventListener("wheel", handleWheel)
      }
    }, 0)
    return () => {
      setTimeout(() => {
        if (cropEl.current) {
          (cropEl.current! as HTMLDivElement).removeEventListener("wheel", handleWheel)
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
        const matched = imageAccepts.find(item => item === fileType)
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
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.src = url
        img.onload = () => setImage(img)
      }
    }
  }

  const resetImage = () => {
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
  }

  React.useEffect(() => {
    resetImage()
    if (!open) {
      setImage(null)
    }
    return () => {
      if (image && /^blob/.test(image.src)) {
        URL.revokeObjectURL(image.src)
      }
    }
  }, [image, open])

  const handleDone = () => {
    if (type === IconType.Custom && image) {
      const canvas = document.createElement("canvas")
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext("2d")!
      ctx.save()
      ctx.arc(SIZE / 2, SIZE / 2, ACTUAL_SIZE / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(image, crop.x, crop.y, image.width * crop.scale, image.height * crop.scale)
      const img = canvas.toDataURL("image/png")
      console.log(img)
    }
    props.onClose()
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Icon Editor</DialogTitle>
        <DialogContent>
          {/* <img src={chrome.runtime.getURL(`icons/${icon}.png`)} alt=""/>
          <div className="cropper">
            <Typography variant="h4">{SIZE}x{SIZE}</Typography>
          </div> */}
          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              name="type"
              value={type}
              onChange={handleChange}
            >
              <FormControlLabel
                label="Official icon"
                value={IconType.Official}
                control={<Radio color="primary" />}
              />
              <FormControlLabel
                label="Custom icon"
                value={IconType.Custom}
                control={<Radio color="primary" />}
              />
            </RadioGroup>
            <FormHelperText>labelPlacement start</FormHelperText>
          </FormControl>
          {type === IconType.Official && (
            <h2>ss</h2>
          )}
          {type === IconType.Custom && (
            <>
              <div
                className={classes.cropperContainer}
                onMouseDown={handleMouseDown}
                ref={cropEl}
              >
                {image && (
                  <img
                    style={{
                      top: crop.y + "px",
                      left: crop.x + "px",
                      width: (image.width * crop.scale) + "px",
                      height: (image.height * crop.scale) + "px",
                    }}
                    onMouseDown={preventImgDrag}
                    src={image.src}
                    alt=""
                  />
                )}
                <div className={classes.cropper} />
                <Tooltip title={chrome.i18n.getMessage("website_edit_icon_reset")}>
                  <AutorenewIcon
                    className={classNames(classes.cropperIcons, classes.resetIcon)}
                    onClick={resetImage}
                  />
                </Tooltip>
                <Tooltip title={chrome.i18n.getMessage("website_edit_icon_help")}>
                  <HelpIcon className={classNames(classes.cropperIcons, classes.helpIcon)} />
                </Tooltip>
              </div>
              <input
                accept="image/*"
                id="select-image"
                type="file"
                className={classes.input}
                onChange={selectImage}
              />
              <label htmlFor="select-image">
                <Button
                  variant="outlined"
                  color="default"
                  size="small"
                  component="span"
                >
                  <AddPhotoIcon className={classes.addPhotoIcon} />
                  {chrome.i18n.getMessage("website_edit_icon_select_file")}
                </Button>
              </label>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDone}>{chrome.i18n.getMessage("button_done")}</Button>
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

export default withStyles(styles)(ShortcutIcon)
