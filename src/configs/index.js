/**
 * some configs
 */

const version = '1.4.5'

const code = 'Apricot'

const classificationMax = 20

const websiteMax = 100

const searchEnginesMax = 30

/**
 * i18n
 */
import moment from 'moment'

import zh_CN from '../locale/zh_CN'
import en_US from '../locale/en_US'

let messages
switch (navigator.language) {
  case 'zh-CN':
    messages = zh_CN
    moment.locale('zh-CN')
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
