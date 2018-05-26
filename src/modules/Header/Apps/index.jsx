import './style.less'

import classNames from 'classnames'
import React, {Component} from 'react'

import {connect} from 'react-redux'

import muiThemeable from 'material-ui/styles/muiThemeable'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import NavigationApps from 'material-ui/svg-icons/navigation/apps'

const style = {
    appBtn: {
        height: 'auto',
        width: '110px',
        minWidth: 'none',
        lineHeight: 'normal',
        borderRadius: '100%',
        overFlow: 'hidden'
    },
    tooltip: {
        fontSize: '14px'
    }
};

class Apps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apps: []
        }
    }

    componentDidMount() {
        /**
         * Get all installed Chrome Apps
         */
        chrome.management.getAll(exInfoArray => {
            const apps = exInfoArray.filter(ex => ex.isApp);
            this.setState({apps})
        })
    }

    render() {
        const {apps} = this.state;
        const {settings, muiTheme} = this.props;

        return (
            <div className="apps-component">
                <div className="tool">
                    <IconButton
                        tooltip={chrome.i18n.getMessage('apps_manage_tip')}
                        tooltipPosition="bottom-right"
                        tooltipStyles={style.tooltip}
                        onClick={() => chrome.tabs.update({url: 'chrome://apps'})}
                    >
                        <NavigationApps color={muiTheme.palette.primary1Color}/>
                    </IconButton>
                    <h1 style={{color: muiTheme.palette.primary1Color}}>{chrome.i18n.getMessage('apps_title')}</h1>
                </div>
                <div className={classNames('apps-collection', {'empty': !apps.length})}>
                    {!apps.length && (
                        <div>
                            <p className="empty-text">{chrome.i18n.getMessage('empty_text_apps')}</p>
                            <RaisedButton
                                label="Web Store"
                                primary={true}
                                href="https://chrome.google.com/webstore?utm_source=MaterialDesignNewTab"
                                target="_blank"
                            />
                        </div>
                    )}
                    {!!apps.length && (
                        <div className="app-box">
                            <a href="https://chrome.google.com/webstore?utm_source=MaterialDesignNewTab">
                                <dl title="Web Store">
                                    <dt>
                                        <img src="chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/0"
                                             alt="Web Store"/>
                                    </dt>
                                    <dd className={classNames({'hide': settings.hideAppsName})}>Web Store</dd>
                                </dl>
                            </a>
                        </div>
                    )}
                    {apps.map(app => {
                        const {id, icons, shortName, enabled} = app;

                        const finds = icons.filter(icon => icon.size === 48);
                        const {url} = finds.length ? finds[0] : icons[icons.length - 1];

                        return (
                            <div className="app-box" key={id}>
                                <dl onClick={() => chrome.management.launchApp(id)} title={shortName}>
                                    <dt>
                                        <img src={`${url}?grayscale=${!enabled}`} alt={shortName}/>
                                    </dt>
                                    <dd className={classNames({'hide': settings.hideAppsName})}>{shortName}</dd>
                                </dl>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {settings} = state;
    return {settings}
};

export default muiThemeable()(connect(mapStateToProps)(Apps))
