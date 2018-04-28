import * as React from "react"
import { inject, observer } from "mobx-react"

import { Settings as SettingsType } from "../store/Settings"

interface PropTypes {
  settings: SettingsType
}

@inject("settings")
@observer
class Theme extends React.Component<PropTypes> {
  public render() {
    return (
      <div>
        <h1>Theme</h1>
        <p>{this.props.settings.themeColor}</p>
      </div>
    )
  }
}

export default Theme
