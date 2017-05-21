import { combineReducers } from 'redux'

import settingsPage from './settings-page'
import settings from './settings'
import searchEngines from './search-engines'
import websites from './websites'

export default combineReducers({
  settingsPage,
  settings,
  searchEngines,
  websites
})
