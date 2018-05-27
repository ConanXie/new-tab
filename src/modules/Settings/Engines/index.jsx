import './style.less'

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    addEngine,
    deleteEngine,
    initialData,
    makeDefault,
    moveDown,
    moveUp,
    updateEngine
} from '../../../actions/search-engines'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import {ListItem} from 'material-ui/List'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ViewList from 'material-ui/svg-icons/action/view-list'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionInfo from 'material-ui/svg-icons/action/info-outline'

import {searchEnginesMax} from '../../../config'

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
};

// form status
const ADD = 'add';
const EDIT = 'edit';

class Engines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            tableOpen: false,
            formOpen: false,
            nameError: '',
            linkError: ''
        };
        this.form = {
            name: '',
            link: ''
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // If user hide the search, initial data if user open this component
        if (!nextProps.engines.length) {
            this.props.initialData()
        }
    }

    openTableDialog = () => {
        this.setState({
            tableOpen: true
        })
    };
    closeTableDialog = () => {
        this.setState({
            tableOpen: false
        })
    };
    edit = index => {
        const {name, link} = this.props.engines[index];
        this.form.name = name;
        this.form.link = link;
        this.form.index = index;
        this.openFormDialog(EDIT)
    };
    openFormDialog = (status = ADD) => {
        this.setState({
            status,
            formOpen: true
        })
    };
    closeEditDialog = () => {
        this.setState({
            formOpen: false,
            nameError: '',
            linkError: '',
        });
        // restore edit form
        this.form.name = '';
        this.form.link = ''
    };
    nameChange = (event, value) => {
        this.form.name = value
    };
    linkChange = (event, value) => {
        this.form.link = value
    };
    handleSubmit = () => {
        const {name, link, index} = this.form;
        const {addEngine, updateEngine, engines} = this.props;
        // check format of user inputing
        let passed = true;
        if (!name.trim()) {
            this.setState({
                nameError: chrome.i18n.getMessage('engines_custom_name_error')
            });
            passed = false
        } else {
            this.setState({
                nameError: ''
            })
        }
        if (!/^http(s)?:\/\/\S+%s/.test(link)) {
            this.setState({
                linkError: chrome.i18n.getMessage('engines_custom_URL_error')
            });
            passed = false
        } else {
            this.setState({
                linkError: ''
            })
        }
        if (!passed) return;

        if (this.state.status === ADD) {
            addEngine(name, link)
        } else {
            // changed then update
            if (engines[index].name !== name || engines[index].link !== link) {
                updateEngine(index, name, link)
            }
        }
        this.closeEditDialog()
    };

    render() {
        const {muiTheme, engines, makeDefault, deleteEngine, moveDown, moveUp} = this.props;
        const {status, tableOpen, formOpen, nameError, linkError} = this.state;
        const {name, link} = this.form;

        const actions = [
            <FlatButton
                label={chrome.i18n.getMessage('button_cancel')}
                primary={true}
                onClick={this.closeEditDialog}
            />,
            <FlatButton
                label={chrome.i18n.getMessage('button_confirm')}
                primary={true}
                onClick={this.handleSubmit}
            />
        ];
        // amount limit
        const AddBtn = engines.length < searchEnginesMax ?
            <IconButton onClick={e => this.openFormDialog()}><ContentAdd/></IconButton> : null;

        return (
            <div>
                <ListItem
                    leftIcon={<ViewList style={{marginLeft: 0}} color={muiTheme.palette.primary1Color}/>}
                    primaryText={chrome.i18n.getMessage('engines_settings_management')}
                    innerDivStyle={{paddingLeft: '58px'}}
                    onClick={this.openTableDialog}
                    className="settings-item"
                />
                <Dialog
                    open={tableOpen}
                    bodyStyle={style.tableDialog}
                    onRequestClose={this.closeTableDialog}
                >
                    <AppBar
                        title={chrome.i18n.getMessage('engines_settings_management')}
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
                                <TableHeaderColumn>{chrome.i18n.getMessage('engines_text')}</TableHeaderColumn>
                                <TableHeaderColumn>{chrome.i18n.getMessage('engines_URL')}</TableHeaderColumn>
                                <TableHeaderColumn style={style.menuRow}/>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                        >
                            {engines.map((row, index) => {
                                const {id, name, link, isDefault} = row;
                                return (
                                    <TableRow key={id}>
                                        <TableRowColumn>{name} {isDefault ? chrome.i18n.getMessage('engines_table_default') : ''}</TableRowColumn>
                                        <TableRowColumn>{link}</TableRowColumn>
                                        <TableRowColumn
                                            style={style.menuRow}
                                        >
                                            <IconMenu
                                                iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                                menuStyle={{minWidth: 168}}
                                            >
                                                {!isDefault && (
                                                    <MenuItem onClick={e => {
                                                        makeDefault(index)
                                                    }} primaryText={chrome.i18n.getMessage('engines_menu_default')}/>
                                                )}
                                                <MenuItem onClick={e => {
                                                    this.edit(index)
                                                }} primaryText={chrome.i18n.getMessage('engines_menu_edit')}/>
                                                {!isDefault && (
                                                    <MenuItem onClick={e => {
                                                        deleteEngine(index)
                                                    }} primaryText={chrome.i18n.getMessage('engines_menu_remove')}/>
                                                )}
                                                {index && (
                                                    <MenuItem onClick={e => {
                                                        moveUp(index)
                                                    }} primaryText={chrome.i18n.getMessage('engines_menu_move_up')}/>
                                                )}
                                                {(index < engines.length - 1) && (
                                                    <MenuItem onClick={e => {
                                                        moveDown(index)
                                                    }} primaryText={chrome.i18n.getMessage('engines_menu_move_down')}/>
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
                    title={status === ADD ? chrome.i18n.getMessage('engines_add') : chrome.i18n.getMessage('engines_edit')}
                    modal={false}
                    actions={actions}
                    open={formOpen}
                    onRequestClose={this.closeEditDialog}
                    contentStyle={style.editDialogContent}
                    titleStyle={style.editDialogTitle}
                >
                    <TextField
                        floatingLabelText={chrome.i18n.getMessage('engines_custom_name_placeholder')}
                        defaultValue={name}
                        style={style.textField}
                        onChange={this.nameChange}
                        errorText={nameError}
                    /><br/>
                    <TextField
                        floatingLabelText={chrome.i18n.getMessage('engines_custom_URL_placeholder')}
                        defaultValue={link}
                        style={style.textField}
                        onChange={this.linkChange}
                        errorText={linkError}
                    />
                    <p className="custom-engines-tip">
                        <ActionInfo style={{width: 18, height: 18}} color="#999"/>
                        <span>{chrome.i18n.getMessage('engines_custom_tip')}</span>
                    </p>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {engines} = state.searchEngines;
    return {engines}
};

export default muiThemeable()(connect(mapStateToProps, {
    initialData,
    addEngine,
    deleteEngine,
    updateEngine,
    makeDefault,
    moveDown,
    moveUp
})(Engines))
