const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  // const pages = Array.from({ length: totalPage }, (_, index) => index + 1);
  const currPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currPage - 1 < 1 ? 1 : currPage - 1
  const next = currPage + 1 > totalPage ? totalPage : currPage + 1

  return {
    // pages,
    totalPage,
    currPage,
    prev,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}
