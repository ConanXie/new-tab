import './settings.less'

import classNames from 'classnames'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {hideSettings} from '../../actions/settings-page'
import {saveSettings} from '../../actions/settings'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import ContentLink from 'material-ui/svg-icons/content/link'
import ActionSearch from 'material-ui/svg-icons/action/search'
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border'
import LightbulbOutline from 'material-ui/svg-icons/action/lightbulb-outline'
import TextFormat from 'material-ui/svg-icons/content/text-format'
import ImageBrightness from 'material-ui/svg-icons/image/brightness-2'
import FileDownload from 'material-ui/svg-icons/file/file-download'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import SettingsRestore from 'material-ui/svg-icons/action/settings-backup-restore'
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard'
import FileCloud from 'material-ui/svg-icons/file/cloud'
import ContentSend from 'material-ui/svg-icons/content/send'
import GPSOff from 'material-ui/svg-icons/device/gps-off'
import LowPriority from 'material-ui/svg-icons/content/low-priority'
import Toggle from 'material-ui/Toggle'
import {ListItem} from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'
import SvgIcon from 'material-ui/SvgIcon'
import {version} from '../../config'

import Donate from './Donate'
import Feedback from './Feedback'
import Theme from './Theme'
import Engines from './Engines'
import Region from './Region'

const FahrenheitIcon = props => {
    return (
        <SvgIcon {...props}>
            <path
                d="M11,20V5H20V8H14V11H19V14H14V20H11M6,3A3,3 0 0,1 9,6A3,3 0 0,1 6,9A3,3 0 0,1 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5Z"/>
        </SvgIcon>
    )
};

const WeatherIcon = props => {
    return (
        <SvgIcon {...props}>
            <path xmlns="http://www.w3.org/2000/svg"
                  d="M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13   c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z"/>
        </SvgIcon>
    )
};

const App = props => {
    return (
        <SvgIcon {...props}>
            <path xmlns="http://www.w3.org/2000/svg"
                  d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
        </SvgIcon>
    )
};

const style = {
    toggleLabel: {
        fontSize: '15px'
    },
    toggleIcon: {
        marginRight: '30px',
        marginLeft: '4px'
    },
    listIcon: {
        marginLeft: 0
    },
    dialogContent: {
        width: 380
    },
    smallIcon: {
        width: 32,
        height: 32
    },
    small: {
        width: 64,
        height: 64,
        padding: 12,
    },
    fileInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0
    },
    snackbar: {
        maxWidth: '150px'
    }
};

class Settings extends Component {
    static propTypes = {
        saveSettings: PropTypes.func.isRequired,
        settings: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            display: 'none',
            resetOpen: false,
            snackbarOpen: false,
            snackbarMessage: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        // show or hide the settings page
        if (nextProps.open !== this.props.open) {
            if (nextProps.open) {
                const state = {
                    display: 'block'
                };
                if (!this.state.load) {
                    state.load = true
                }
                this.setState(state)
            } else {
                setTimeout(() => {
                    document.querySelector('.settings-page > section').scrollTop = 0;
                    this.setState({
                        display: 'none'
                    })
                }, 200)
            }
        }
    }

    createBackups = async () => {
        const sync = await new Promise((resolve, reject) => {
            chrome.storage.sync.get(['websites', 'classified', 'engines'], result => {
                const arr = [];
                const {websites, classified, engines} = result;
                if (!Array.isArray(websites)) {
                    resolve([[], [{name: 'unclassified', set: []}], engines])
                } else {
                    resolve([websites, classified, engines])
                }
            })
        });
        try {
            let settings;
            if (window.localStorage.settings) {
                settings = JSON.parse(window.localStorage.settings)
            }

            const data = JSON.stringify({
                settings: settings ? settings : {},
                websites: sync[0],
                classified: sync[1],
                engines: sync[2]
            });
            const backups = new Blob([data], {type: 'application/json'});
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(backups);
            a.download = 'backups.json';
            a.click()
        } catch (error) {
            // console.log(error)
        }
    };
    restoreBackups = (e) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.onloadend = e => {
            const {settings, websites, classified, engines} = JSON.parse(e.target.result);
            if (!classified) {
                this.setState({
                    snackbarOpen: true,
                    snackbarMessage: chrome.i18n.getMessage('settings_br_restore_not_supported')
                });
                return
            }

            window.localStorage.setItem('settings', JSON.stringify(settings));
            chrome.storage.sync.set({websites, classified, engines});

            this.setState({
                snackbarOpen: true,
                snackbarMessage: chrome.i18n.getMessage('settings_br_restore_message')
            })
        };
        fr.readAsText(file)
    };
    openReset = () => {
        this.setState({
            resetOpen: true
        })
    };
    hideReset = () => {
        this.setState({
            resetOpen: false
        })
    };
    resetSettings = () => {
        window.localStorage.removeItem('settings');
        this.setState({
            snackbarOpen: true,
            snackbarMessage: chrome.i18n.getMessage('settings_br_reset_message')
        });
        this.hideReset()
    };
    closeSnackerbar = () => {
        this.setState({
            snackbarOpen: false
        })
    };

    render() {
        const {open, settings, muiTheme, hideSettings, saveSettings} = this.props;
        const {display, appActive, load, currentTheme, snackbarOpen, snackbarMessage, weatherOpen} = this.state;
        const resetActions = [
            <FlatButton
                label={chrome.i18n.getMessage('button_cancel')}
                primary={true}
                onClick={this.hideReset}
            />,
            <FlatButton
                label={chrome.i18n.getMessage('button_confirm')}
                primary={true}
                onClick={this.resetSettings}
            />
        ];
        return (
            <div
                style={{display}}
            >
                {load && (
                    <div className={classNames('settings-page', {
                        'show-settings-page': open,
                        'hide-settings-page': !open
                    })}>
                        <Paper
                            className="header-bar settings-header-bar"
                            style={{backgroundColor: muiTheme.palette.primary1Color}}
                            rounded={false}
                            transitionEnabled={false}
                            zDepth={1}
                        >
                            <div className="tool-bar">
                                <div className="bar-left">
                                    <IconButton onClick={hideSettings}>
                                        <ArrowBack color={muiTheme.palette.alternateTextColor}/>
                                    </IconButton>
                                    <div className="bar-label"
                                         style={{color: muiTheme.palette.alternateTextColor}}>{chrome.i18n.getMessage('settings_toolbar_title')}</div>
                                </div>
                            </div>
                        </Paper>
                        <section style={{backgroundColor: muiTheme.palette.settingsBackgroundColor}}>
                            <div className="settings-section">
                                <Paper className="settings-content" zDepth={1}>
                                    <div className="toggle-box">
                                        <ContentLink style={style.toggleIcon} color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_website_open_label')}
                                                defaultToggled={settings.linkTarget}
                                                onToggle={(event, bool) => {
                                                    saveSettings({linkTarget: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    <div className="toggle-box">
                                        <App style={style.toggleIcon} color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_apps')}
                                                defaultToggled={settings.appActive}
                                                onToggle={(event, bool) => {
                                                    saveSettings({appActive: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    {settings.appActive && (<div className="toggle-box">
                                        <TextFormat style={style.toggleIcon} color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_apps_display_label')}
                                                defaultToggled={settings.hideAppsName}
                                                onToggle={(event, bool) => {
                                                    saveSettings({hideAppsName: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>)}
                                    <div className="toggle-box">
                                        <BookmarkBorder style={style.toggleIcon}
                                                        color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_bookmarks_position_label')}
                                                defaultToggled={settings.rememberBookmarksState}
                                                onToggle={(event, bool) => {
                                                    saveSettings({rememberBookmarksState: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    {/*search*/}
                                    <h2 className="settings-title"
                                        style={{color: muiTheme.palette.secondaryTextColor}}>{chrome.i18n.getMessage('settings_search_title')}</h2>
                                    <Engines/>
                                    <div className="toggle-box">
                                        <ActionSearch style={style.toggleIcon} color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_engine_search_label')}
                                                defaultToggled={settings.searchTarget}
                                                onToggle={(event, bool) => {
                                                    saveSettings({searchTarget: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    <div className="toggle-box">
                                        <LightbulbOutline style={style.toggleIcon}
                                                          color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_search_predict_label')}
                                                defaultToggled={settings.searchPredict}
                                                onToggle={(event, bool) => {
                                                    saveSettings({searchPredict: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    <div className="toggle-box">
                                        <LowPriority style={style.toggleIcon} color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_search_remaining_label')}
                                                defaultToggled={settings.remaining}
                                                onToggle={(event, bool) => {
                                                    saveSettings({remaining: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    {/*theme*/}
                                    <h2 className="settings-title"
                                        style={{color: muiTheme.palette.secondaryTextColor}}>{chrome.i18n.getMessage('settings_theme_title')}</h2>
                                    <Theme/>
                                    <div className="toggle-box">
                                        <ImageBrightness style={style.toggleIcon}
                                                         color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_theme_dark_label')}
                                                defaultToggled={settings.darkMode}
                                                onToggle={(event, bool) => {
                                                    saveSettings({darkMode: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    {/*Weather*/}
                                    <h2 className="settings-title"
                                        style={{color: muiTheme.palette.secondaryTextColor}}>{chrome.i18n.getMessage('settings_weather_title')}</h2>
                                    <div className="toggle-box">
                                        <WeatherIcon style={style.toggleIcon}
                                                     color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_weather_active')}
                                                defaultToggled={settings.weatherActive}
                                                onToggle={(event, bool) => {
                                                    saveSettings({weatherActive: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>
                                    {settings.weatherActive && (<div className="toggle-box">
                                        <FahrenheitIcon style={style.toggleIcon}
                                                        color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_weather_fahrenheit_label')}
                                                defaultToggled={settings.useFahrenheit}
                                                onToggle={(event, bool) => {
                                                    saveSettings({useFahrenheit: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>)}
                                    {settings.weatherActive && (<div className="toggle-box">
                                        <GPSOff style={style.toggleIcon} color={muiTheme.palette.primary1Color}/>
                                        <div className="toggle-wrapper">
                                            <Toggle
                                                className="toggle"
                                                label={chrome.i18n.getMessage('settings_weather_gps_off_label')}
                                                defaultToggled={settings.blockGeolocation}
                                                onToggle={(event, bool) => {
                                                    saveSettings({blockGeolocation: bool})
                                                }}
                                                labelStyle={style.toggleLabel}
                                            />
                                        </div>
                                    </div>)}
                                    {settings.weatherActive && (<Region/>)}
                                    {/*backup and restore*/}
                                    <h2 className="settings-title"
                                        style={{color: muiTheme.palette.secondaryTextColor}}>{chrome.i18n.getMessage('settings_br_title')}</h2>
                                    <ListItem
                                        leftIcon={<FileUpload style={style.listIcon}
                                                              color={muiTheme.palette.primary1Color}/>}
                                        primaryText={chrome.i18n.getMessage('settings_br_backup_label')}
                                        innerDivStyle={{paddingLeft: '58px'}}
                                        onClick={this.createBackups}
                                        className="settings-item"
                                    />
                                    <ListItem
                                        leftIcon={<FileDownload style={style.listIcon}
                                                                color={muiTheme.palette.primary1Color}/>}
                                        primaryText={chrome.i18n.getMessage('settings_br_restore_label')}
                                        innerDivStyle={{paddingLeft: '58px'}}
                                        className="settings-item"
                                    >
                                        <input type="file" style={style.fileInput} accept="application/json"
                                               onChange={this.restoreBackups}/>
                                    </ListItem>
                                    <ListItem
                                        leftIcon={<SettingsRestore style={style.listIcon}
                                                                   color={muiTheme.palette.primary1Color}/>}
                                        primaryText={chrome.i18n.getMessage('settings_br_reset_label')}
                                        innerDivStyle={{paddingLeft: '58px'}}
                                        onClick={this.openReset}
                                        className="settings-item"
                                    />
                                </Paper>
                                <Dialog
                                    title={chrome.i18n.getMessage('settings_reset_title')}
                                    open={this.state.resetOpen}
                                    actions={resetActions}
                                    onRequestClose={this.hideReset}
                                    contentStyle={style.dialogContent}
                                >
                                    {chrome.i18n.getMessage('settings_reset_warning')}
                                </Dialog>
                            </div>
                            <div className="settings-section">
                                <Paper className="settings-content about" zDepth={1}>
                                    <h3>{chrome.i18n.getMessage('settings_about_title')}</h3>
                                    <p className="name">
                                        <span>{chrome.i18n.getMessage('appDescription')} </span>
                                        <a
                                            href={navigator.language === 'zh-CN' ? 'https://tab.xiejie.co/logs' : 'https://github.com/ConanXie/new-tab/blob/master/CHANGELOG.md'}
                                            target="_blank"
                                        >
                                            <FlatButton label={version}/>
                                        </a>
                                    </p>
                                    <div className="donate-feedback">
                                        <Donate/>
                                        <Feedback/>
                                    </div>
                                    <div className="hot-key-box">
                                        <div className="tip">
                                            <HardwareKeyboard style={{width: 18, height: 18}} color="#999"/>
                                            <span>{chrome.i18n.getMessage('hotkey_title')}</span>
                                        </div>
                                        <div className="hot-key-list">
                                            <span
                                                className="hot-key-item">{chrome.i18n.getMessage('hotkey_apps')}</span>
                                            <span className="hot-key">Alt + A</span>
                                        </div>
                                        <div className="hot-key-list">
                                            <span
                                                className="hot-key-item">{chrome.i18n.getMessage('hotkey_bookmarks')}</span>
                                            <span className="hot-key">Alt + B</span>
                                        </div>
                                        <div className="hot-key-list">
                                            <span
                                                className="hot-key-item">{chrome.i18n.getMessage('hotkey_settings')}</span>
                                            <span className="hot-key">Alt + S</span>
                                        </div>
                                    </div>
                                    <div className="tip">
                                        <FileCloud style={{width: 18, height: 18}} color="#999"/>
                                        <span>{chrome.i18n.getMessage('settings_about_weather_sources')}: YAHOO! & HeWeather</span>
                                    </div>
                                    {navigator.language !== 'zh-CN' && (
                                        <div className="tip">
                                            <ContentSend style={{width: 18, height: 18}} color="#999"/>
                                            <span>If you want to add additional languages support or have some suggestions, please give me feedback. Thank you.</span>
                                        </div>
                                    )}
                                    {/*<p className="intro">Please create an issue on <a href="https://github.com/ConanXie/react-koa-website/issues" target="_blank">Github</a> if you have any problems when using this extension. Thank you 😉</p>*/}
                                </Paper>
                            </div>
                        </section>
                        <Snackbar
                            open={snackbarOpen}
                            message={snackbarMessage}
                            autoHideDuration={2000}
                            onRequestClose={this.closeSnackerbar}
                            bodyStyle={style.snackbar}
                        />
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {settings, settingsPage} = state;
    return {settings, open: settingsPage}
};

export default muiThemeable()(connect(mapStateToProps, {hideSettings, saveSettings})(Settings))
