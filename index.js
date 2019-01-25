
export function testEmail (value) {
  let reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
  value += ''
  if (value) {
    return reg.test(value.trim())
  }
  return false
}

export function testPhone (value) {
  let reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
  return reg.test(value)
}

// 根据不同区号,做不同的验证
export function testPhoneFix (value, region) {
  const regs = {
    CHN: /^[ ]*1\d{10}[ ]*$/,
    HKG: /^[ ]*\d{8}[ ]*$/,
    MAC: /^[ ]*6\d{7}[ ]*$/,
    TWN: /^[ ]*\d{10}[ ]*$/,
    SGP: /^[ ]*\d{1,50}[ ]*$/,
    MYS: /^[ ]*\d{1,50}[ ]*$/,
    IDN: /^[ ]*\d{1,50}[ ]*$/
  }
  return regs[region].test(value)
}

export function addClass (el, className) { // el：元素  className：带新增的样式类名
  if (hasClass(el, className)) {
    return 0
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 判断是否拥有某个样式类
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

// 判断是否是pc[true] moblie[false]
export function IsPC () {
  let userAgentInfo = navigator.userAgent
  let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (var i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) > 0) {
      flag = false
      break
    }
  }
  return flag
}
 
// 设置cookie
export function setCookie (name, value, expires, domain, path, secure) {
  let cookieText = ''
  cookieText += encodeURIComponent(name) + '=' + encodeURIComponent(value)
  if (expires instanceof Date) {
    cookieText += '; expires=' + expires.toGMTString()
  }
  if (path) {
    cookieText += '; path=' + path
  } else {
    cookieText += '; path=/'
  }
  if (domain) {
    cookieText += '; domain=' + domain
  }
  if (secure) {
    cookieText += '; secure'
  }
  document.cookie = cookieText
}

// 从cookie中获取数据
export function getCookie (name) {
  let arr = ''
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

// 删除cookie
export function delCookie (name) {
  var expires = new Date()
  expires.setTime(expires.getTime() - 1)
  var value = getCookie(name)
  if (value !== null) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; expires=' + expires.toGMTString()
    document.cookie = cookieText
  }
}

// 16进制转2进制 字符串
export function hexToBin (value) {
  if (!value) {
    return value
  }
  return parseInt(value, 16).toString(2)
}

// 2进制转16进制 字符串
export function binToHex (value) {
  if (!value) {
    return value
  }
  return parseInt(value, 2).toString(16)
}

export function debounce (func, wait, immediate) {
  var timeout
  return function debFn (...args) {
    // console.log('>>>>>>debFn ' + +new Date());
    var context = this
    var later = function laterFn () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

// 数字添加前缀[大于0：+,小于0： -]
export function numFix (num, toFixed = true, fixNum = 3) {
  if (!isNumber(num)) {
    return num
  }
  if (typeof num !== 'number') {
    num = Number(num)
  }
  if (num >= 0) {
    return '+' + toThousands(num, toFixed, fixNum)
  } else {
    return toThousands(num, toFixed, fixNum)
  }
}

/**
 * isNumber
 * 合理的数字，数字字符串
 * */
export function isNumber (n) {
  var reg = /^-?[0-9]+\.?[0-9]*$/
  return reg.test(n)
}

/**
 * @数字千分符
 * n: 将被处理的值
 * isToFixed: 标记是否进行保留小数位处理(默认true)
 * limitNum: 保留的小数位(默认2位小数)
 * **/
export function toThousands (n, isToFixed = true, limitNum = 2) {
  if (!isNumber(n)) {
    return n
  }
  var flag = true
  if (Number(n) < 0) {
    flag = false
    n = Math.abs(n)
  }
  if (isToFixed) {
    n = numToFixed(n, limitNum)
  }
  var re = /\d{1,3}(?=(\d{3})+$)/g
  var n1 = (n || 0).toString().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, '$&,') + s2 })
  return flag ? n1 : '-' + n1
}

// 保留两位小数
export function numToFixed (num, n) { // num：数字 n：保留的位数
  return toFixed(num, n)
}

/**
 * 四舍五入（解决toFixed的精度异常）
 * @param {Number} num 待处理的小数
 * @param {Number} s 保留小数位数
 * @returns {String} 返回字符串
 */
export function toFixed (num, s) {
  // 非数值类型
  if (!isNumber(num)) {
    return num
  }
  if (typeof s !== 'number') {
    return num
  }
  if (typeof num !== 'number') {
    num = Number(num)
  }

  // 保留小数位(0 至 100)
  if (s < 0 || s > 100) {
    return ''
  }

  // 取正
  let value = num < 0 ? -num : num
  // 取整
  s = Math.floor(s)

  var times = Math.pow(10, s)
  var des = (value * (times * 10) + 5) / 10
  des = parseInt(des, 10) / times
  if (num < 0) {
    return '-' + des.toFixed(s)
  }
  return des.toFixed(s)
}

/**
 * @日期格式转换fun
 * t: new Date(time)
 * f: '/' '-' '.' 连接符,可配 ['yyyy-MM-dd hh:mm:ss']
 * flag: true/false 表示是否转换为 'xxxx年xx月xx日'
 * 使用方式: selfDateFormat(new Date(t), 'yyyy/MM/dd hh:mm:ss', true)
 */
export function selfDateFormat (t, f, flag) {
  if (t.toString().indexOf('Invalid Date') > -1 || t instanceof (Date) === false) { // Invalid return
    return ''
  }
  var obj = {
    yyyy: t.getFullYear(),
    yy: ('' + t.getFullYear()).slice(-2),
    M: t.getMonth() + 1,
    MM: ('0' + (t.getMonth() + 1)).slice(-2),
    d: t.getDate(),
    dd: ('0' + t.getDate()).slice(-2),
    hh: ('0' + t.getHours()).slice(-2),
    h: t.getHours(),
    mm: ('0' + t.getMinutes()).slice(-2),
    m: t.getMinutes(),
    ss: ('0' + t.getSeconds()).slice(-2),
    s: t.getSeconds()
  }
  var tarResult = ''
  tarResult += f.replace(/([a-z]+)/ig, function (r) {
    return obj[r]
  })
  if (flag) {
    var mark = f.charAt(f.indexOf('M') - 1)
    var markArr = ['年', '月', '日']
    var _tarResult = ''
    tarResult = tarResult.split(' ')
    tarResult[0].split(mark).forEach((item, index) => {
      _tarResult += item + markArr[index]
    })
    if (tarResult.length > 2) { // hours min sec
      tarResult[1] = tarResult[tarResult.length - 1]
    } else if (tarResult.length === 1) { // no hour min sec
      tarResult[1] = ''
    }
    tarResult = _tarResult + ' ' + tarResult[1]
  }
  return tarResult
}

// 修改title
export function setTitleHack (t) {
  document.title = t
  let iframe = document.createElement('iframe')
  iframe.style.visibility = 'hidden'
  iframe.style.width = '1px'
  iframe.style.height = '1px'
  iframe.src = ''
  iframe.onload = function () {
    setTimeout(function () {
      iframe.remove()
    }, 10)
  }
  document.body.appendChild(iframe)
}

// 手机唤起app[weixin://, mqq://]
export function callApp (urlScheme, downloadUrl) { // urlScheme: app, downloadUrl: app下载地址
  var browser = {
    versions: (function () {
      var u = navigator.userAgent
      // var app = navigator.appVersion
      return {
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, /* 苹果、谷歌内核 */
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, /* 火狐内核 */
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), /* 是否为移动终端 */
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), /* ios终端 */
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, /* android终端或者uc浏览器 */
        iPhone: u.indexOf('iPhone') > -1, /* 是否为iPhone或者QQHD浏览器 */
        iPad: u.indexOf('iPad') > -1, /* 是否iPad */
        webApp: u.indexOf('Safari') === -1, /* 是否web应该程序，没有头部与底部 */
        souyue: u.indexOf('souyue') > -1,
        superapp: u.indexOf('superapp') > -1,
        weixin: u.toLowerCase().indexOf('micromessenger') > -1,
        Safari: u.indexOf('Safari') > -1
      }
    }()),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }
  if (browser.versions.ios) {
    window.location.href = urlScheme
    let t = Date.now()
    setTimeout(function () {
      if (Date.now() - t < 1000) { // 下载地址
        window.location.href = downloadUrl
        window.location.href = downloadUrl
      } else {
        window.close()
      }
    }, 1000)
  } else if (browser.versions.android) {
    let t = Date.now()
    window.location.href = urlScheme
    setTimeout(function () {
      if (Date.now() - t < 2000) {
        window.location.href = downloadUrl
      } else {
        window.close()
      }
    }, 1000)
  }
}

// 跳转app 应用市场
export function jumpToMarket (downloadUrl) {
  window.location = downloadUrl
}

// 空内容处理
export function nullContent (val) {
  if (val === '' || val === null || val === undefined) {
    return '--'
  }
  return val
}

/**
 *js获取一个元素的样式属性
 *obj: dom元素
 *attr: 样式属性(height,width)
 **/
export function getStyle (obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  } else {
    return getComputedStyle(obj, false)[attr]
  }
}

/**
 *控制元素滚动
 **/
export function touchMoveElement (el) {
  var translateStartY = 0
  var translateEndYTemp = 0
  var windowInnerHeight = window.innerHeight
  var elHeight = getStyle(el, 'height').slice(0, getStyle(el, 'height').indexOf('px'))
  // 每一次触发'复位'
  el.style.transform = 'translate(0, ' + 0 + 'px)'
  el.style.transition = 'all 0.1s ease'

  el.addEventListener('touchstart', (e) => {
    // 初始位置
    translateStartY = e.touches[0].pageY
  })

  el.addEventListener('touchmove', (e) => {
    e.preventDefault()
    // if (windowInnerHeight < elHeight + 20) {
    // 滑动间距
    translateEndYTemp = e.touches[0].pageY - translateStartY
    el.style.transform = 'translate(0, ' + translateEndYTemp + 'px)'
    el.style.transition = 'all 0.1s ease'
    // }
  })

  el.addEventListener('touchend', (e) => {
    // 防止无限滑动(复位)
    // if (translateEndYTemp < -60) {
    //   translateEndYTemp = -60
    // }
    if (translateEndYTemp < Number(windowInnerHeight - elHeight)) {
      translateEndYTemp = Number(windowInnerHeight - elHeight) - 50
    }
    if (translateEndYTemp > 0) {
      translateEndYTemp = 0
    }
    el.style.transform = 'translate(0, ' + translateEndYTemp + 'px)'
    el.style.transition = 'all 0.1s ease'
  })
}

// 数组或者对象的深度clone 
export function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    const res = {}
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}

export function cloneData (data) {
  if (Object.prototype.toString.call(data) === "[object Array]") {
    var _arr = [];
    for (let item of data) {
      _arr.push(cloneData(item))
    }
    return _arr;
  }
  if (Object.prototype.toString.call(data) === "[object Object]") {
    var _obj = {};
    for (let item in data) {
      _obj[item] = cloneData(data[item])
    }
    return _obj;
  }
  return data;
}
export function deepCopy (obj) {
  if (typeof obj !== 'object') return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
          newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
      }
  }
  return newObj;
}