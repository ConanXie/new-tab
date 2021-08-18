import React, { FC, Suspense, useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"

import AddIcon from "@material-ui/icons/Add"
import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import ClearIcon from "@material-ui/icons/Clear"
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd"
import WallpaperIcon from "@material-ui/icons/WallpaperOutlined"
import WidgetsIcon from "@material-ui/icons/WidgetsOutlined"
import SettingsIcon from "@material-ui/icons/SettingsOutlined"

import grab, { Env } from "./Website/grab"
import { Shortcut } from "../../store/desktop"
import {
  toolbarStore,
  desktopStore,
  menuStore,
  websiteEditStore,
  websiteInfoStore,
} from "../../store"
import { MenuType } from "store/menu"
// import WidgetWrap from "../Widgets/Wrap"
import DateTime from "../Widgets/DateTime"
import Webiste from "./Website"
import Undo from "./Undo"
import Folder from "./Folder"
import Wrap from "./Wrap"
import FolderEditor from "./FolderEditor"
import { observer } from "mobx-react-lite"

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
          const folder = desktopStore.findById(currentItem.current.id)
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
        icon: <ClearIcon />,
        text: "Remove",
        onClick: () => {
          desktopStore.removeFolder(currentItem.current.id)
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
        icon: <ClearIcon />,
        text: "Remove",
        onClick: () => {
          removeWebsite()
        },
      },
    ],
    [],
  )

  const handleShortcutGrab = (shortcut: Shortcut, componentId: string) => (
    event: React.MouseEvent<HTMLElement>,
  ) => {
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
    desktopStore.removeWebsite(currentItem.current.id, currentItem.current.index)
    setUndoOpen(true)
  }
  const handleFolderEditDone = (label?: string) => {
    if (label !== undefined) {
      desktopStore.updateFolder(currentItem.current.id, label)
    }
    setFolderEditorOpen(false)
  }
  const closeUndo = () => {
    setUndoOpen(false)
  }
  const handleContextMenu = (event: MouseEvent) => {
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
        }
      }
      if (target === desktopElement.current) {
        desktopMenus[0].disabled = desktopStore.isFilled
        const menus = desktopStore.toolbar ? desktopMenus : [...desktopMenus, ...toolbarMenus]
        showMenu(event, menus)
        return
      }
    }
  }
  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu)

    return () => document.removeEventListener("contextmenu", handleContextMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { toolbar, columns, rows, data } = desktopStore
  // const { open: folderOpen, closeFolder, openFolder, folderElement } = folderStore
  const styles: React.CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridAutoRows: `calc((100vh - ${toolbar ? 64 : 0}px) / ${rows})`,
  }

  return (
    <div className={clsx("desktop", { toolbar })} ref={desktopElement}>
      <div className="page" id="desktop" ref={pageElement} style={styles}>
        {data.map((item) => {
          const { row, column } = item
          if (item.type === 1) {
            if (item.shortcuts!.length <= 1) {
              const { id, shortcuts } = item
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
                  <Folder {...item} />
                </Wrap>
              )
            }
          }
          return null
        })}
        <Wrap className="widget-wrap" row={1} column={4} rowEnd={2} columnEnd={6}>
          <DateTime />
        </Wrap>
      </div>
      <Suspense fallback={null}>
        <>
          <WebsiteInfo />
          <WebsiteEdit />
        </>
      </Suspense>
      <Undo open={undoOpen} onClose={closeUndo} />
      <FolderEditor open={folderEditorOpen} label={folderLabel} onClose={handleFolderEditDone} />
    </div>
  )
}

export default observer(Desktop)
