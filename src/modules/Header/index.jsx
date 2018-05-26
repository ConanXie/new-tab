import './style.less'

import classNames from 'classnames'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import * as settingsPageActions from '../../actions/settings-page'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import ActionBookmark from 'material-ui/svg-icons/action/bookmark-border'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import DeviceWallpaper from 'material-ui/svg-icons/device/wallpaper'
import Drawer from 'material-ui/Drawer'

import Weather from './Weather'
import Apps from './Apps'
import Bookmark from './Bookmark'
import Wallpaper from './Wallpaper'
// import { bindActionCreators } from 'redux'
// import Wallpaper from './Wallpaper'
// import LazilyLoad, { importLazy } from '@/scripts/LazilyLoad'

const style = {
    headerBar: {
        backgroundColor: 'transparent'
    },
    rightIcon: {
        marginLeft: '4px'
    }
};

class Header extends Component {
    static propsType = {
        showSettings: PropTypes.func.isRequired,
        hideSettings: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            weatherOpen: false,
            bookmarkOpen: false,
            wallpaperOpen: false,
            loadApps: false,
            loadBookmarks: false,
            loadWallpaper: false
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', () => {
            const {weatherOpen, bookmarkOpen} = this.state;
            const {settingsPage, showSettings, hideSettings} = this.props;
            const {keyCode, altKey} = window.event;
            // console.log(window.event)
            // listen Alt + B
            if (keyCode === 66 && altKey) {
                this.setState({
                    bookmarkOpen: !bookmarkOpen,
                    loadBookmarks: true
                })
            }
            // listen Alt + A
            if (keyCode === 65 && altKey) {
                this.setState({
                    weatherOpen: !weatherOpen,
                    loadApps: true
                })
            }
            // listen Alt + S
            if (keyCode === 83 && altKey) {
                settingsPage ? hideSettings() : showSettings()
            }
        }, false)
    }

    render() {
        const {showSettings, settings, muiTheme} = this.props;
        const {weatherOpen, bookmarkOpen, wallpaperOpen, loadApps, loadBookmarks, loadWallpaper} = this.state;
        const {topShadow, darkMode, background, backgroundShade} = settings;

        let iconColor = muiTheme.palette.textColor;
        if ((topShadow && !darkMode) || (background && backgroundShade === 2)) {
            iconColor = 'rgba(255, 255, 255, 0.87)'
        }

        return (
            <Paper
                className={classNames('header-bar', {'has-shadow': settings.topShadow})}
                rounded={false}
                zDepth={0}
                transitionEnabled={false}
                style={style.headerBar}
            >
                <div className="tool-bar">
                    <div className="bar-left">
                        <IconButton
                            onClick={() => this.setState({weatherOpen: true, loadApps: true})}
                        >
                            <NavigationMenu color={iconColor}/>
                        </IconButton>
                    </div>
                    <div className="bar-right">
                        <IconButton style={style.rightIcon}
                                    onClick={() => this.setState({bookmarkOpen: true, loadBookmarks: true})}>
                            <ActionBookmark color={iconColor}/>
                        </IconButton>
                        <IconButton style={style.rightIcon}
                                    onClick={() => this.setState({wallpaperOpen: true, loadWallpaper: true})}>
                            <DeviceWallpaper color={iconColor}/>
                        </IconButton>
                        <IconButton style={style.rightIcon} onClick={showSettings}>
                            <ActionSettings color={iconColor}/>
                        </IconButton>
                    </div>
                </div>
                <Drawer
                    docked={false}
                    width={600}
                    open={weatherOpen}
                    onRequestChange={state => this.setState({weatherOpen: state})}
                >
                    {loadApps && (
                        <div>
                            <Weather/>
                            <Apps/>
                        </div>
                    )}
                </Drawer>
                <Drawer
                    docked={false}
                    width={360}
                    openSecondary={true}
                    open={wallpaperOpen}
                    onRequestChange={state => this.setState({wallpaperOpen: state})}
                    overlayStyle={{opacity: 0}}
                >
                    {loadWallpaper && (
                        <Wallpaper closeDrawer={() => this.setState({wallpaperOpen: false})}/>
                    )}
                </Drawer>
                <Drawer
                    docked={false}
                    width={480}
                    openSecondary={true}
                    open={bookmarkOpen}
                    onRequestChange={state => this.setState({bookmarkOpen: state})}
                >
                    {loadBookmarks && (
                        <Bookmark/>
                    )}
                </Drawer>
            </Paper>
        )
    }
}

const mapStateToProps = state => {
    const {settingsPage, settings} = state;
    return {settingsPage, settings}
};

export default muiThemeable()(connect(mapStateToProps, settingsPageActions)(Header))
