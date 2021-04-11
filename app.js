const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const webRoutes = require('./routes/webroutes')
const clientRoutes = require('./routes/clientroutes')
const serverRoutes = require('./routes/serverroutes')

// the Express web framework
const app = express()

// view engine setup,  pug = high performance template engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
// Returns middleware that only parses urlencoded bodies
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routing part ----------------------------
app.use('/', webRoutes)
app.use('/client', clientRoutes)
app.use('/server', serverRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
