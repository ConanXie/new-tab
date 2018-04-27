/**
 * Get rids of the missing requestAnimationFrame polyfill warning.
 * 
 * @link https://reactjs.org/docs/javascript-environment-requirements.html
 * @copyright 2004-present Facebook. All Rights Reserved.
 */
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0)
}

/**
 * chrome extension API mocks
 */
const messages = require('../extension/_locales/en/messages.json')

global.chrome = {
  i18n: {
    getMessage: key => messages[key].message
  }
}

