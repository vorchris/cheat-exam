// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')
const fileUpload = require("express-fileupload");
const rateLimit = require('express-rate-limit')  //simple ddos protection


// express router routes
const clientRoutes = require('./src/routes/clientroutes')
const serverRoutes = require('./src/routes/serverroutes')

 

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 200, // Limit each IP to 100 requests per `window` 
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



async function createServer( root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
  const resolve = (p) => path.resolve(__dirname, p)
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
  const manifest = isProd ? require('./dist/client/ssr-manifest.json') : {}  // @ts-ignore

  const app = express()
  app.use(express.json())
  app.use(fileUpload())  //When you upload a file, the file will be accessible from req.files
  app.use(limiter) // Apply the rate limiting middleware to all requests
  // Routing part 
  app.use('/client', clientRoutes)
  app.use('/server', serverRoutes)



  let vite
  if (!isProd) {
    vite = await require('vite').createServer({ root, logLevel: 'info',  server: { middlewareMode: 'ssr', watch: { usePolling: true, interval: 100 } } })
    app.use(vite.middlewares)  // use vite's connect instance as middleware  
  } 
  else {
    app.use( require('compression')())
    app.use( require('serve-static')(resolve('dist/client'), { index: false }) )
  }



  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template, render

      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } 
      else {
        template = indexProd
        render = require('./dist/server/entry-server.js').render
      }

      const [appHtml, preloadLinks] = await render(url, manifest)
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } 
    catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
)


// for test use
exports.createServer = createServer
