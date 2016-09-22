import { combineReducers } from 'redux'

import setupPage from './setup-page'
import settings from './settings'

export default combineReducers({
  setupPage,
  settings
})