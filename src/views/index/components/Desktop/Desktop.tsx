import React, { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { toJS } from "mobx"

import AddIcon from "@mui/icons-material/AddOutlined"
import EditIcon from "@mui/icons-material/EditOutlined"
import InfoIcon from "@mui/icons-material/InfoOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import PlaylistAddIcon from "@mui/icons-material/PlaylistAddOutlined"
import WallpaperIcon from "@mui/icons-material/WallpaperOutlined"
import WidgetsIcon from "@mui/icons-material/WidgetsOutlined"
import FitScreenOutlinedIcon from "@mui/icons-material/FitScreenOutlined"

import grab, { Env } from "./Website/grab"
import { Shortcut } from "../../store/desktop"
import {
  toolbarStore,
  desktopStore,
  menuStore,
  websiteEditStore,
  websiteInfoStore,
  desktopSettings,
  widgetStore,
} from "../../store"
import { MenuType } from "store/menu"
// import WidgetWrap from "../Widgets/Wrap"
// import DateTime from "../Widgets/DateTime"
import Scallop from "../Widgets/Clocks/Scallop"
import Webiste from "./Website"
import Undo from "./Undo"
import Folder from "./Folder"
import Wrap from "./Wrap"
import FolderEditor from "./FolderEditor"
import { Settings as SettingsIcon } from "components/icons"
import { Widget } from "../Widgets/Widget"
import { WidgetResize } from "../Widgets/Widget/WidgetResize"
import DateTime from "../Widgets/DateTime"
import Box from "@mui/material/Box"

const WebsiteInfo = React.lazy(() => import("./WebsiteInfo"))
const WebsiteEdit = React.lazy(() => import("./WebsiteEdit"))

const Desktop: FC = () => {
  const [undoOpen, setUndoOpen] = useState(false)
  const [folderEditorOpen, setFolderEditorOpen] = useState(false)
  const [folderLabel, setFolderLabel] = useState("")

  const currentItem = useRef({
    id: "",
    index: 0,
  })

  const desktopElement = useRef<HTMLDivElement>(null)
  const pageElement = useRef<HTMLDivElement>(null)

  const desktopState = useLocalObservable(() => desktopStore)
  const widgetState = useLocalObservable(() => widgetStore)

  const desktopMenus: MenuType[] = useMemo(
    () => [
      {
        icon: <AddIcon />,
        text: "New shortcut",
        onClick: () => {
          currentItem.current.id = ""
          editWebsite()
        },
      },
    ],
    [],
  )
  const toolbarMenus: MenuType[] = useMemo(
    () => [
      {
        icon: <WallpaperIcon />,
        text: "Wallpaper",
        onClick: () => {
          toolbarStore.loadAndOpenWallpaperDrawer()
        },
      },
      {
        icon: <WidgetsIcon />,
        text: "Widgets",
        // eslint-disable-next-line
        onClick: () => {},
      },
      {
        icon: <SettingsIcon />,
        text: "Settings",
        onClick: () => {
          location.href = "settings.html"
        },
      },
    ],
    [],
  )

  const folderMenus: MenuType[] = useMemo(
    () => [
      {
        icon: <EditIcon />,
        text: "Edit",
        onClick: () => {
          const folder = desktopState.findById(currentItem.current.id)
          if (folder) {
            setFolderEditorOpen(true)
            setFolderLabel(folder.label!)
          }
        },
      },
      {
        icon: <PlaylistAddIcon />,
        text: "Add new shortcut",
        onClick: () => {
          editWebsite()
        },
      },
      {
        icon: <DeleteIcon />,
        text: "Remove",
        onClick: () => {
          desktopState.removeFolder(currentItem.current.id)
          setUndoOpen(true)
        },
      },
    ],
    [],
  )

  const shortcutMenus: MenuType[] = useMemo(
    () => [
      {
        icon: <EditIcon />,
        text: "Edit",
        onClick: () => {
          editWebsite()
        },
      },
      {
        icon: <InfoIcon />,
        text: "Shortcut info",
        onClick: () => {
          showInfo()
        },
      },
      {
        icon: <DeleteIcon />,
        text: "Remove",
        onClick: () => {
          removeWebsite()
        },
      },
    ],
    [],
  )

  const widgetMenus: MenuType[] = useMemo(
    () => [
      {
        icon: <FitScreenOutlinedIcon />,
        text: "Resize",
        onClick: () => {
          widgetStore.activeResizableMode(currentItem.current.id)
        },
      },
      {
        icon: <SettingsIcon />,
        text: "Widget settings",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick: () => {},
      },
      {
        icon: <InfoIcon />,
        text: "Widget info",
        onClick: () => {
          showInfo()
        },
      },
      {
        icon: <DeleteIcon />,
        text: "Remove",
        onClick: () => {
          removeWebsite()
        },
      },
    ],
    [],
  )

  const handleShortcutGrab =
    (shortcut: Shortcut, componentId: string) => (event: React.MouseEvent<HTMLElement>) => {
      if (event.button === 0) {
        grab(event, shortcut, componentId, Env.Desktop)
      }
    }

  const showMenu = (event: MouseEvent, menus: MenuType[], id?: string, index = 0) => {
    if (id) {
      currentItem.current.id = id
      currentItem.current.index = index
    }
    menuStore.setPosition(event.clientX, event.clientY)
    menuStore.showMenu(menus)
  }

  const editWebsite = () => {
    websiteEditStore.openDialog(currentItem.current.id, currentItem.current.index)
  }

  const showInfo = () => {
    websiteInfoStore.openDialog(currentItem.current.id, currentItem.current.index)
  }
  const removeWebsite = () => {
    desktopState.removeWebsite(currentItem.current.id, currentItem.current.index)
    setUndoOpen(true)
  }
  const handleFolderEditDone = (label?: string) => {
    if (label !== undefined) {
      desktopState.updateFolder(currentItem.current.id, label)
    }
    setFolderEditorOpen(false)
  }
  const closeUndo = () => {
    setUndoOpen(false)
  }
  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      const path = event.composedPath() as HTMLElement[]
      for (const target of path) {
        const { dataset } = target
        if (dataset) {
          const { type, id, index } = dataset
          if (type === "shortcut") {
            showMenu(event, shortcutMenus, id, Number(index))
            return
          } else if (type === "folder") {
            showMenu(event, folderMenus, id, Number(index))
            return
          } else if (type === "widget") {
            showMenu(event, widgetMenus, id, Number(index))
            return
          }
        }
        if (target === desktopElement.current) {
          desktopMenus[0].disabled = desktopState.isFilled
          const menus = desktopSettings.toolbar ? desktopMenus : [...desktopMenus, ...toolbarMenus]
          showMenu(event, menus)
          return
        }
      }
    },
    [desktopMenus, folderMenus, shortcutMenus, toolbarMenus],
  )

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu)

    return () => document.removeEventListener("contextmenu", handleContextMenu)
  }, [handleContextMenu])

  const { toolbar, columns, rows } = desktopSettings
  const { data } = desktopState

  return (
    <div className={clsx("desktop", { toolbar })} ref={desktopElement}>
      <Box
        className="page"
        id="desktop"
        ref={pageElement}
        sx={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: `calc((100vh - ${toolbar ? 64 : 0}px) / ${rows})`,
        }}
      >
        {data.map((item) => {
          const { id, row, rowEnd, column, columnEnd, shortcuts, widgetName } = item
          if (item.type === 1) {
            if (shortcuts!.length <= 1) {
              const { label, url, id: shortcutId } = shortcuts![0]
              return (
                <Wrap row={row} column={column} key={id}>
                  <Webiste
                    id={shortcutId}
                    label={label}
                    url={url}
                    itemId={id}
                    index={0}
                    onMouseDown={handleShortcutGrab(shortcuts![0], id)}
                  />
                </Wrap>
              )
            } else {
              const { id } = item
              return (
                <Wrap row={row} column={column} key={id}>
                  <Folder {...toJS(item)} />
                </Wrap>
              )
            }
          } else if (item.type === 2) {
            const rowSize = rowEnd! - row
            const colSize = columnEnd! - column
            return (
              <Wrap
                row={row}
                column={column}
                rowEnd={rowEnd}
                columnEnd={columnEnd}
                key={id}
                className="widget-wrapper"
              >
                <Widget
                  id={id}
                  row={rowSize}
                  col={colSize}
                  rowStart={row}
                  colStart={column}
                  rowEnd={rowEnd!}
                  colEnd={columnEnd!}
                >
                  {widgetName == "DateTime" && <DateTime row={rowSize} col={colSize} />}
                  {widgetName == "Scallop" && <Scallop row={rowSize} col={colSize} />}
                </Widget>
              </Wrap>
            )
          }
          return null
        })}
      </Box>
      <Suspense fallback={null}>
        <>
          <WebsiteInfo />
          <WebsiteEdit />
        </>
      </Suspense>
      <Undo open={undoOpen} onClose={closeUndo} />
      <FolderEditor open={folderEditorOpen} label={folderLabel} onClose={handleFolderEditDone} />
      {widgetState.widget && <WidgetResize />}
    </div>
  )
}

export default observer(Desktop)
