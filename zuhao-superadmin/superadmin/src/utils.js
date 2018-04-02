import moment from 'moment'
moment.locale('zh-cn')
export const filterNumber = string => {
  if (!string) return null
  return string.split('').filter(item => (isNaN(parseInt(item)) ? false : true)).join('')
}
export function timeFormat(timestamp) {
  const now = moment(timestamp)
  return now.format('YYYY年 MM月 DD日 HH:mm')
}
export function toNow(endtime) {
  const now = new Date().getTime()
  if (now > endtime) return '0'
  const a = moment()
  const b = moment(endtime)
  const diff = b.diff(a, 'minutes')
  return diff
}

export function split(length, str) {
  let len = 0
  for (let i = 0, l = str.length; i < l; i++) len += str.charCodeAt(i) > 255 ? 2 : 1
  if (len < length) return str
  let fl = parseInt(length / 2)
  let fr = fl
  const al = []
  const ar = []
  const s = str.split('')
  while (fl > 0 && s.length != 0) {
    fl -= s[0].charCodeAt(0) > 255 ? 2 : 1
    al.push(s.shift())
  }
  while (fr > 0 && s.length != 0) {
    fr -= s[s.length - 1].charCodeAt(0) > 255 ? 2 : 1
    ar.unshift(s.pop())
  }
  return al.join('') + '...' + ar.join('')
}
