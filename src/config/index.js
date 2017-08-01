/**
 * Configure for the program
 */

const version = '1.8.0'

const code = 'Apricot'

const classificationMax = 20

const websiteMax = 100

const searchEnginesMax = 30

/**
 * i18n
 */
import moment from 'moment'

import {
  zh_CN,
  zh_TW,
  en_US
} from '../locales'

let messages
switch (navigator.language) {
  case 'zh-CN':
    messages = zh_CN
    moment.locale('zh-CN')
    break
  case 'zh-TW':
  case 'zh-HK':
    messages = zh_TW
    moment.locale('zh-TW')
    break
  default:
    messages = en_US
    break
}

export {
  version,
  code,
  classificationMax,
  websiteMax,
  searchEnginesMax,
  messages
}
