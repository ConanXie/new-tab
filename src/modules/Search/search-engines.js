export default [{
  name: 'Google',
  className: 'google',
  link: 'https://www.google.com/search?q=%s',
  predict: 'https://www.google.com/complete/search?client=serp&hl=%l&q=%s&xhr=t'
}, {
  name: '百度',
  className: 'baidu',
  link: 'https://www.baidu.com/s?wd=%s',
  predict: 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=%s&json=1'
}, {
  name: '搜狗',
  className: 'sogou',
  link: 'https://www.sogou.com/web?query=%s',
  predict: 'https://www.sogou.com/suggnew/ajajjson?key=%s&type=web'
}, {
  name: 'Bing',
  className: 'bing',
  link: 'https://www.bing.com/search?q=%s',
  predict: 'https://www.google.com/complete/search?client=serp&hl=%l&q=%s&xhr=t'
}]