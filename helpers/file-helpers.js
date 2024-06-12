const fs = require('fs')

const localFileHandler = async file => {
  // file 是 multer 處理完的檔案
  if (!file) return null

  const fileName = `upload/${file.originalname}`
  const data = await fs.promises.readFile(file.path)
  await fs.promises.writeFile(fileName, data)
  return `/${fileName}`
}
module.exports = {
  localFileHandler
}
