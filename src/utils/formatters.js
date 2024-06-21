export const capitalizeFirstLetter = (str) => {
  if (!str) return ''
  return str[0].toUpperCase() + str.slice(1)
}
export const convertStringToLongArray = (str) => {
  if (!str) {
    // Nếu rỗng, trả về mảng rỗng
    return []
  }

  // Tách chuỗi thành mảng các phần tử ID
  const idStrings = str.split(',')

  // Chuyển đổi mỗi phần tử ID sang kiểu Long
  const longArray = idStrings.map(idString => parseInt(idString, 10))

  // Trả về mảng kiểu Long
  return longArray
}
export const convertStringToStringArray = (str) => {
  if (!str) {
    // Nếu rỗng, trả về mảng rỗng
    return []
  }

  // Tách chuỗi thành mảng các phần tử ID
  const idStrings = str.split(',')
  return idStrings
}