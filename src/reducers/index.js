import { combineReducers } from 'redux'

import setupPage from './setup-page'
import settings from './settings'
import searchEngines from './search-engines'
import websites from './websites'

export default combineReducers({
  setupPage,
  settings,
  searchEngines,
  websites
})