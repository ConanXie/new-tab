import { combineReducers } from 'redux'

import setupPage from './setup-page'
import settings from './settings'
import searchEngine from './search-engine'
import websites from './websites'

export default combineReducers({
  setupPage,
  settings,
  searchEngine,
  websites
})