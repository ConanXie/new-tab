/**
 * Fetch predictions from the API of the search engine's server
 * @param {String} url 
 * @param {String} text 
 */
function getPredictions(url, text) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(url.replace('%l', chrome.i18n.getUILanguage()).replace('%s', text) + `&r=${Date.now()}`)
      // extract the encoding of response headers, e.g. UTF-8
      const encoding = /[\w\-]+$/.exec(res.headers.get('Content-Type'))[0]
      const blob = await res.blob()
      const fr = new FileReader()
      fr.onloadend = () => resolve(fr.result)
      fr.readAsText(blob, encoding)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Format predictions
 * @param {String} text 
 */
function google(text) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.google.com/complete/search?client=serp&hl=%l&q=%s&xhr=t'
    try {
      const predictions = await getPredictions(url, text)
      const formatted = JSON.parse(predictions)
      const results = []
      formatted[1].forEach(p => {
        results.push(p[0])
      })
      resolve(results)
    } catch (error) {
      reject(error)
    }
  })
}

function googleHK(text) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.google.com.hk/complete/search?client=serp&hl=%l&q=%s&xhr=t'
    try {
      const predictions = await getPredictions(url, text)
      const formatted = JSON.parse(predictions)
      const results = []
      formatted[1].forEach(p => {
        results.push(p[0])
      })
      resolve(results)
    } catch (error) {
      reject(error)
    }
  })
}

function baidu(text) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=%s&json=1'
    try {
      const predictions = await getPredictions(url, text)
      const formatted = JSON.parse(predictions.replace(/^window\.baidu\.sug\(/, '').replace(/\);$/, ''))
      const results = []
      formatted.s.forEach(p => {
        results.push(p)
      })
      resolve(results)
    } catch (error) {
      reject(error)
    }
  })
}

function sogou(text) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.sogou.com/suggnew/ajajjson?key=%s&type=web'
    try {
      const predictions = await getPredictions(url, text)
      const formatted = JSON.parse(predictions.replace(/^window\.sogou\.sug\(/, '').replace(/\,\-1\);$/, ''))
      const results = []
      formatted[1].forEach(p => {
        results.push(p)
      })
      resolve(results)
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  'www.google.com': google,
  'www.google.com.hk': googleHK,
  'www.bing.com': google,
  'www.baidu.com': baidu,
  'www.sogou.com': sogou
}
