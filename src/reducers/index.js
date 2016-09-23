import { combineReducers } from 'redux'

import setupPage from './setup-page'
import settings from './settings'
import searchEngine from './search-engine'

export default combineReducers({
  setupPage,
  settings,
  searchEngine
})