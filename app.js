const createError = require('http-errors')
const express = require('express')
const fileUpload = require("express-fileupload");
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const eta = require('eta')  //view engine
const rateLimit = require('express-rate-limit')  //simple ddos protection


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` 
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



// express router routes
const baseRoutes = require('./src/routes/baseroutes')
const clientRoutes = require('./src/routes/clientroutes')
const serverRoutes = require('./src/routes/serverroutes')

 
// the Express web framework
const app = express()

// view engine setup,  https://eta.js.org/  
app.engine('eta', eta.renderFile)
app.set('view engine', 'eta')
app.set('views', path.join(__dirname, 'src/views'))

app.use(logger('dev'))  //tiny, common, dev - logs all http requests to the terminal
app.use(express.json())
app.use(express.urlencoded({ extended: false }))   // Returns middleware that only parses urlencoded bodies
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))  //serve static files for the webview
app.use(fileUpload())  //When you upload a file, the file will be accessible from req.files
app.use(limiter) // Apply the rate limiting middleware to all requests



app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

// Routing part 
app.use('/', baseRoutes)
app.use('/client', clientRoutes)
app.use('/server', serverRoutes)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}   // set locals, only providing error in development
  res.status(err.status || 500) // render the error page
  res.render('error')
})

module.exports = app
