function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function strDisCode(str) {
  str = str.replace(/&nbsp;/g,'\xa0')
  str = str.replace(/&Uuml;/g, '\xdc')
  str = str.replace(/&uuml;/g, '\xfc')
  str = str.replace(/&Ouml;/g, '\xd6')
  str = str.replace(/&ouml;/g, '\xf6')
  str = str.replace(/&Aring;/g, '\xc5')
  str = str.replace(/&aring;/g, '\xe6')

  return str
}

export default {
  formatNumber,
  formatTime
}
