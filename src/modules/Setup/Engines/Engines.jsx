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
  componentDidMount() {
    this.props.initialData()
  }
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
  setAsDefault = index => {
    const { engines, setDefault } = this.props
    // when the target engine is not default
    if (!engines[index].isDefault) {
      setDefault(index)
    }
  }
  edit = index => {
    const { name, link } = this.props.engines[index]
    this.form.name = name
    this.form.link = link
    this.form.index = index
    this.openFormDialog(EDIT)
  }
  remove = index => {
    this.props.deleteEngine(index)
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
      linkError: ''
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
    const { name, link, index } = this.form
    const { addEngine, updateEngine, engines } = this.props
    // check format of user inputing
    let passed = true
    if (!name.trim()) {
      this.setState({
        nameError: '别忘了搜索引擎名字'
      })
      passed = false
    } else {
      this.setState({
        nameError: ''
      })
    }
    if (!/^http(s)?:\/\/\S+%s/.test(link)) {
      this.setState({
        linkError: '网址格式不正确'
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
    const { muiTheme, engines } = this.props
    const { status, tableOpen, formOpen, nameError, linkError } = this.state
    const { name, link } = this.form

    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        onTouchTap={this.closeEditDialog}
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
          leftIcon={<ViewList style={{ marginLeft: 0 }} color={muiTheme.palette.primary1Color} />}
          primaryText="管理搜索引擎"
          innerDivStyle={{ paddingLeft: '58px' }}
          onTouchTap={this.openTableDialog}
        />
        <Dialog
          open={tableOpen}
          bodyStyle={style.tableDialog}
          onRequestClose={this.closeTableDialog}
        >
          <AppBar
            title="管理搜索引擎"
            iconElementRight={<IconButton onTouchTap={e => this.openFormDialog()}><ContentAdd /></IconButton>}
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
                <TableHeaderColumn>搜索引擎</TableHeaderColumn>
                <TableHeaderColumn>网址</TableHeaderColumn>
                <TableHeaderColumn style={style.menuRow}></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
            >
              {engines.map((row, index) => {
                const { name, predict, link, isDefault } = row
                return (
                  <TableRow key={index}>
                    <TableRowColumn>{name} {isDefault ? '（默认）' : undefined}</TableRowColumn>
                    <TableRowColumn>{link}</TableRowColumn>
                    <TableRowColumn
                      style={style.menuRow}
                    >
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      >
                        <MenuItem onTouchTap={e => { this.setAsDefault(index) }} primaryText="设为默认搜索引擎" />
                        {!predict && (
                          <MenuItem onTouchTap={e => { this.edit(index) }} primaryText="修改" />
                        )}
                        {!predict && (
                          <MenuItem onTouchTap={e => { this.remove(index) }} primaryText="从列表中移除" />
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
          title={(status === ADD ? '增加' : '修改') + '搜索引擎'}
          modal={false}
          actions={actions}
          open={formOpen}
          onRequestClose={this.closeEditDialog}
          contentStyle={style.editDialogContent}
          titleStyle={style.editDialogTitle}
        >
          <TextField
            floatingLabelText="搜索引擎"
            defaultValue={name}
            style={style.textField}
            onChange={this.nameChange}
            errorText={nameError}
          /><br />
          <TextField
            floatingLabelText="网址（用 %s 代替搜索字词）"
            defaultValue={link}
            style={style.textField}
            onChange={this.linkChange}
            errorText={linkError}
          />
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