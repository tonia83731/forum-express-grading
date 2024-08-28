if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const { apis } = require('./routes')
// const session = require('express-session')
const passport = require('./config/passport')
// const SESSION_SECRET = 'secret'
const app = express()
const port = process.env.PORT || 3000

const { getUser } = require('./helpers/auth-helpers')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(
//   session({
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use((req, res, next) => {
  next()
})

app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})
app.use('/api', apis)

app.listen(port, () => {
  console.info(`Example app listening on port http://localhost:${port}/`)
})

module.exports = app

// https://medium.com/tds-note/how-failure-message-works-in-passport-js-512e453af8a3
