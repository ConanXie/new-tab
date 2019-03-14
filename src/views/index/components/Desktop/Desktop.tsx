import React from "react"
import { inject, observer } from "mobx-react"
import Loadable from "react-loadable"

import AddIcon from "@material-ui/icons/Add"
import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import ClearIcon from "@material-ui/icons/Clear"

import makeDumbProps from "utils/makeDumbProps"
import grab, { Env } from "./Website/grab"
import { DesktopStore, Shortcut } from "../../store/desktop"
import { WebSiteInfoStore } from "../../store/websiteInfo"
import { WebsiteEditStore } from "../../store/websiteEdit"
import { FolderStore } from "../../store/folder"
import { MenuType, MenuStore } from "store/menu"
// import WidgetWrap from "../Widgets/Wrap"
import DateTime from "../Widgets/DateTime"
import Webiste from "./Website"
import Undo from "./Undo"
import Folder from "./Folder"
import Wrap from "./Wrap"
import FolderWindow from "./FolderWindow"

const LazyComponent = Loadable.Map({
  loading: () => null,
  loader: {
    WebsiteInfo: () => import("./WebsiteInfo"),
    WebsiteEdit: () => import("./WebsiteEdit"),
  },
  render(loaded, props) {
    const WebsiteInfo = loaded.WebsiteInfo.default
    const WebsiteEdit = loaded.WebsiteEdit.default
    return (
      <>
        <WebsiteInfo />
        <WebsiteEdit />
      </>
    )
  },
})

interface PropsType {
  desktopStore: DesktopStore
  menuStore: MenuStore
  websiteInfoStore: WebSiteInfoStore
  websiteEditStore: WebsiteEditStore
  folderStore: FolderStore
}

@inject(
  "desktopStore",
  "menuStore",
  "websiteInfoStore",
  "websiteEditStore",
  "folderStore",
)
@observer
class Desktop extends React.Component<PropsType> {
  public state = {
    undoOpen: false,
  }
  public desktopMenus: MenuType[] = [{
    icon: <AddIcon />,
    text: "New shortcut",
    onClick: () => {
      this.id = ""
      this.editWebsite()
    }
  }]
  public shortcutMenus: MenuType[] = [{
    icon: <EditIcon />,
    text: "Edit",
    onClick: () => {
      this.editWebsite()
    }
  }, {
    icon: <InfoIcon />,
    text: "Shortcut info",
    onClick: () => {
      this.showInfo()
    }
  }, {
    icon: <ClearIcon />,
    text: "Remove",
    onClick: () => {
      this.removeWebsite()
    },
  }]
  public id = ""
  public index = 0
  private desktopElement: React.RefObject<HTMLDivElement> = React.createRef()
  private pageElement: React.RefObject<HTMLDivElement> = React.createRef()

  public handleShortcutGrab = (shortcut: Shortcut, componentId: string) => (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      grab(event, shortcut, componentId, Env.Desktop)
    }
  }
  // private prevent
  private showMenu = (event: MouseEvent, menus: MenuType[], id?: string, index: number = 0) => {
    if (id) {
      this.id = id
      this.index = index
    }
    this.props.menuStore.setPosition(event.clientX, event.clientY)
    this.props.menuStore.showMenu(menus)
  }
  public editWebsite = () => {
    this.props.websiteEditStore.openDialog(this.id, this.index)
  }
  public showInfo = () => {
    this.props.websiteInfoStore.openDialog(this.id, this.index)
  }
  public removeWebsite = () => {
    this.props.desktopStore.removeWebsite(this.id, this.index)
    this.setState({ undoOpen: true })
  }
  public closeUndo = () => {
    this.setState({ undoOpen: false })
  }
  public handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    const path = event.composedPath() as HTMLElement[]
    for (const target of path) {
      const { dataset } = target
      if (dataset) {
        const { type, id, index } = dataset
        if (type === "shortcut") {
          this.showMenu(event, this.shortcutMenus, id, Number(index))
          return
        }
      }
      if (target === this.desktopElement.current) {
        this.showMenu(event, this.desktopMenus)
        return
      }
    }
  }
  public componentDidMount() {
    document.addEventListener("contextmenu", this.handleContextMenu)
  }
  public componentWillUnmount() {
    document.removeEventListener("contextmenu", this.handleContextMenu)
  }
  public render() {
    const { columns, rows, data } = this.props.desktopStore
    const { open: folderOpen, closeFolder, openFolder, folderElement } = this.props.folderStore
    const styles: React.CSSProperties = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridAutoRows: `calc((100vh - 64px) / ${rows})`,
    }
    return (
      <div className="desktop" ref={this.desktopElement}>
        <div className="page" id="desktop" ref={this.pageElement} style={styles}>
          {data.map(item => {
            const { row, column } = item
            if (item.type === 1) {
              if (item.shortcuts!.length <= 1) {
                const { id, shortcuts } = item
                const {
                  label,
                  url,
                  id: shortcutId,
                } = shortcuts![0]
                return (
                  <Wrap row={row} column={column} key={id}>
                    <Webiste
                      id={shortcutId}
                      label={label}
                      url={url}
                      itemId={id}
                      index={0}
                      onMouseDown={this.handleShortcutGrab(shortcuts![0], id)}
                    />
                  </Wrap>
                )
              } else {
                const { id } = item
                return (
                  <Wrap row={row} column={column} key={id}>
                    <Folder
                      {...item}
                      onClick={openFolder}
                    />
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
        <LazyComponent />
        <Undo open={this.state.undoOpen} onClose={this.closeUndo} />
        <FolderWindow
          open={folderOpen}
          anchorEl={folderElement}
          onClose={closeFolder}
        />
      </div>
    )
  }
}

export default makeDumbProps(Desktop)
