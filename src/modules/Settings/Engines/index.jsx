import './style.less'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as searchEnginesActions from '../../../actions/search-engines'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { List, ListItem } from 'material-ui/List'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ViewList from 'material-ui/svg-icons/action/view-list'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionInfo from 'material-ui/svg-icons/action/info-outline'

import { searchEnginesMax } from '../../../configs'

const style = {
  tableDialog: {
    padding: 0
  },
  appbar: {
    paddingRight: '4px'
  },
  appbarTitle: {
    fontSize: '18px',
    height: '56px',
    lineHeight: '56px',
  },
  appbarRightIcon: {
    marginTop: '4px',
    marginRight: 0
  },
  table: {
    margin: '0 4px'
  },
  menuRow: {
    width: '48px',
    paddingLeft: 0,
    paddingRight: 0
  },
  editDialogContent: {
    width: '380px'
  },
  editDialogTitle: {
    paddingBottom: 0
  },
  textField: {
    width: '332px'
  },
}

// form status
const ADD = 'add'
const EDIT = 'edit'

class Engines extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      status: '',
      tableOpen: false,
      formOpen: false,
      nameError: '',
      linkError: ''
    }
    this.form = {
      name: '',
      link: ''
    }
  }
  /*componentDidMount() {
    this.props.initialData()
  }*/
  componentWillReceiveProps(next) {
    // console.log(next)
  }
  openTableDialog = () => {
    this.setState({
      tableOpen: true
    })
  }
  closeTableDialog = () => {
    this.setState({
      tableOpen: false
    })
  }
  edit = index => {
    const { name, link } = this.props.engines[index]
    this.form.name = name
    this.form.link = link
    this.form.index = index
    this.openFormDialog(EDIT)
  }
  openFormDialog = (status = ADD) => {
    this.setState({
      status,
      formOpen: true
    })
  }
  closeEditDialog = () => {
    this.setState({
      formOpen: false,
      nameError: '',
      linkError: '',
    })
    // restore edit form
    this.form.name = ''
    this.form.link = ''
  }
  nameChange = (event, value) => {
    this.form.name = value
  }
  linkChange = (event, value) => {
    this.form.link = value
  }
  handleSubmit = () => {
    const { intl } = this.context
    const { name, link, index } = this.form
    const { addEngine, updateEngine, engines } = this.props
    // check format of user inputing
    let passed = true
    if (!name.trim()) {
      this.setState({
        nameError: intl.formatMessage({ id: 'engines.custom.name.error' })
      })
      passed = false
    } else {
      this.setState({
        nameError: ''
      })
    }
    if (!/^http(s)?:\/\/\S+%s/.test(link)) {
      this.setState({
        linkError: intl.formatMessage({ id: 'engines.custom.URL.error' })
      })
      passed = false
    } else {
      this.setState({
        linkError: ''
      })
    }
    if (!passed) return

    if (this.state.status === ADD) {
      addEngine(name, link)
    } else {
      // changed then update
      if (engines[index].name !== name || engines[index].link !== link) {
        updateEngine(index, name, link)
      }
    }
    this.closeEditDialog()
  }
  render() {
    const { intl } = this.context
    const { muiTheme, engines, makeDefault, deleteEngine, moveDown, moveUp } = this.props
    const { status, tableOpen, formOpen, nameError, linkError } = this.state
    const { name, link } = this.form

    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.closeEditDialog}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.handleSubmit}
      />
    ]
    // amount limit
    const AddBtn = engines.length < searchEnginesMax ? <IconButton onTouchTap={e => this.openFormDialog()}><ContentAdd /></IconButton> : null
    
    return (
      <div>
        <ListItem
          leftIcon={<ViewList style={{ marginLeft: 0 }} color={muiTheme.palette.primary1Color} />}
          primaryText={intl.formatMessage({ id: 'engines.settings.management' })}
          innerDivStyle={{ paddingLeft: '58px' }}
          onTouchTap={this.openTableDialog}
        />
        <Dialog
          open={tableOpen}
          bodyStyle={style.tableDialog}
          onRequestClose={this.closeTableDialog}
        >
          <AppBar
            title={intl.formatMessage({ id: 'engines.settings.management' })}
            iconElementRight={AddBtn}
            showMenuIconButton={false}
            style={style.appbar}
            titleStyle={style.appbarTitle}
            iconStyleRight={style.appbarRightIcon}
          />
          <Table
            height="320px"
            selectable={false}
            multiSelectable={false}
            wrapperStyle={style.table}
          >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
              <TableRow>
                <TableHeaderColumn>{intl.formatMessage({ id: 'engines.text' })}</TableHeaderColumn>
                <TableHeaderColumn>{intl.formatMessage({ id: 'engines.URL' })}</TableHeaderColumn>
                <TableHeaderColumn style={style.menuRow}></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
            >
              {engines.map((row, index) => {
                const { id, name, link, isDefault } = row
                return (
                  <TableRow key={id}>
                    <TableRowColumn>{name} {isDefault ? intl.formatMessage({ id: 'engines.table.default' }) : ''}</TableRowColumn>
                    <TableRowColumn>{link}</TableRowColumn>
                    <TableRowColumn
                      style={style.menuRow}
                    >
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        menuStyle={{ minWidth: 168 }}
                      >
                        {!isDefault && (
                          <MenuItem onTouchTap={e => { makeDefault(index) }} primaryText={intl.formatMessage({ id: 'engines.menu.default' })} />
                        )}
                        <MenuItem onTouchTap={e => { this.edit(index) }} primaryText={intl.formatMessage({ id: 'engines.menu.edit' })} />
                        {!isDefault && (
                          <MenuItem onTouchTap={e => { deleteEngine(index) }} primaryText={intl.formatMessage({ id: 'engines.menu.remove' })} />
                        )}
                        {index && (
                          <MenuItem onTouchTap={e => { moveUp(index) }} primaryText={intl.formatMessage({ id: 'engines.menu.move.up' })} />
                        )}
                        {(index < engines.length - 1) && (
                          <MenuItem onTouchTap={e => { moveDown(index) }} primaryText={intl.formatMessage({ id: 'engines.menu.move.down' })} />
                        )}
                      </IconMenu>
                    </TableRowColumn>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Dialog>
        <Dialog
          title={status === ADD ? intl.formatMessage({ id: 'engines.add' }) : intl.formatMessage({ id: 'engines.edit' })}
          modal={false}
          actions={actions}
          open={formOpen}
          onRequestClose={this.closeEditDialog}
          contentStyle={style.editDialogContent}
          titleStyle={style.editDialogTitle}
        >
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'engines.custom.name.placeholder' })}
            defaultValue={name}
            style={style.textField}
            onChange={this.nameChange}
            errorText={nameError}
          /><br />
          <TextField
            floatingLabelText={intl.formatMessage({ id: 'engines.custom.URL.placeholder' })}
            defaultValue={link}
            style={style.textField}
            onChange={this.linkChange}
            errorText={linkError}
          />
          <p className="custom-engines-tip">
            <ActionInfo style={{ width: 18, height: 18 }} color="#999" />
            <span>{intl.formatMessage({ id: 'engines.custom.tip' })}</span>
          </p>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { engines } = state.searchEngines
  return { engines }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(searchEnginesActions, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Engines))
