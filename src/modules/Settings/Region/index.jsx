import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { saveSettings } from '../../../actions/settings'

import muiThemeable from 'material-ui/styles/muiThemeable'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import EditLocation from 'material-ui/svg-icons/maps/edit-location'

const style = {
  dialogContent: {
    width: '380px'
  },
  dialogTitle: {
    paddingBottom: '0'
  },
  textField: {
    width: '332px'
  },
  snackbar: {
    maxWidth: '150px'
  }
}

class Region extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      snackbarOpen: false
    }
  }
  openDialog = () => {
    const { blockGeolocation, region } = this.props.settings
    if (blockGeolocation) {
      this.region = region
      this.setState({
        dialogOpen: true
      })
    } else {
      this.setState({
        snackbarOpen: true
      })
    }
  }
  hideDialog = () => {
    this.setState({
      dialogOpen: false
    })
  }
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
    })
  }
  regionChange = (event, value) => {
    this.region = value
  }
  handleSubmit = () => {
    this.props.saveSettings({ region: this.region.trim() })
    this.hideDialog()
  }
  render() {
    const { muiTheme, settings } = this.props
    const { dialogOpen, snackbarOpen } = this.state

    const actions = [
      <FlatButton
        label={chrome.i18n.getMessage('button_cancel')}
        primary={true}
        onClick={this.hideDialog}
      />,
      <FlatButton
        label={chrome.i18n.getMessage('button_confirm')}
        primary={true}
        onClick={this.handleSubmit}
      />
    ]

    return (
      <div>
        <ListItem
          leftIcon={<EditLocation style={{ marginLeft: 0 }} color={muiTheme.palette.primary1Color} />}
          primaryText={chrome.i18n.getMessage('settings_weather_location_label')}
          secondaryText={settings.region ? settings.region : 'N/A'}
          innerDivStyle={{ paddingLeft: '58px' }}
          onClick={this.openDialog}
          className="settings-item"
        />
        <Dialog
          title={chrome.i18n.getMessage('region_edit_title')}
          actions={actions}
          modal={false}
          open={dialogOpen}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <TextField
            floatingLabelText={chrome.i18n.getMessage('region_input_placeholder')}
            defaultValue={settings.region}
            style={style.textField}
            onChange={this.regionChange}
          />
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          message={chrome.i18n.getMessage('region_tip_geolocation')}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { settings } = state
  return { settings }
}

export default muiThemeable()(connect(mapStateToProps, { saveSettings })(Region))
