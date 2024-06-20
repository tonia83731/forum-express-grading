const fs = require('fs')
const imgur = require('imgur')
const localFileHandler = async file => {
  // file 是 multer 處理完的檔案
  if (!file) return null

  const fileName = `upload/${file.originalname}`
  const data = await fs.promises.readFile(file.path)
  await fs.promises.writeFile(fileName, data)
  return `/${fileName}`
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(error => reject(error))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
