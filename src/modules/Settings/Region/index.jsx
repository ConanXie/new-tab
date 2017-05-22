import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsActions from '../../../actions/settings'

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
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
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
    const { intl } = this.context
    const { muiTheme, settings } = this.props
    const { dialogOpen, snackbarOpen } = this.state

    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideDialog}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.handleSubmit}
      />
    ]

    return (
      <div>
        <ListItem
          leftIcon={<EditLocation style={{ marginLeft: 0 }} color={muiTheme.palette.primary1Color} />}
          primaryText={intl.formatMessage({ id: 'settings.weather.location.label' })}
          secondaryText={settings.region ? settings.region : 'N/A'}
          innerDivStyle={{ paddingLeft: '58px' }}
          onTouchTap={this.openDialog}
        />
        <Dialog
          title={intl.formatMessage({ id: 'region.edit.title' })}
          actions={actions}
          modal={false}
          open={dialogOpen}
          onRequestClose={this.hideDialog}
          contentStyle={style.dialogContent}
          titleStyle={style.dialogTitle}
        >
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'region.input.placeholder' })}
            defaultValue={settings.region}
            style={style.textField}
            onChange={this.regionChange}
          />
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          message={intl.formatMessage({ id: 'region.tip.geolocation' })}
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators(settingsActions, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Region))
