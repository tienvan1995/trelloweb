export const sortByArrayOrder = (array, key, arrayOrder) => {
  if (!array || !arrayOrder || !key) return []
  // Tạo một map từ key sang vị trí trong mảng keyOrder
  const cloneArray = [...array]
  // Sử dụng phương thức `sort()` để sắp xếp mảng
  return cloneArray.sort((a, b) => {
    return arrayOrder.indexOf(a[key])- arrayOrder.indexOf(b[key])
  })
}