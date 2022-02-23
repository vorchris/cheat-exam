import fs from 'fs'
import path from 'path'
import express from "express"
import fileUpload from "express-fileupload";
import rateLimit  from 'express-rate-limit' //simple ddos protection
import * as vite from 'vite'
import config from './src/config.js';
import multicastclient from './src/classes/multicastclient.js'

import {clientRouter} from './src/routes/clientroutes.js'   // express router routes
import {serverRouter} from './src/routes/serverroutes.js'


const __dirname = path.resolve();
const limiter = rateLimit({ windowMs: 1 * 60 * 1000,  max: 300, standardHeaders: true, legacyHeaders: false,})
multicastclient.init()
config.multicastclient = multicastclient



async function createServer( root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
  let vitebuild
  const resolve = (p) => path.resolve(__dirname, p)
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
  const manifest = isProd ? require('./dist/client/ssr-manifest.json') : {}  // @ts-ignore
  const app = express()

  app.use(express.json())
  app.use(fileUpload())  //When you upload a file, the file will be accessible from req.files
  app.use(limiter) // Apply the rate limiting middleware to all requests
  
  // Routing part 
  app.use('/client', clientRouter)
  app.use('/server', serverRouter)

 
  if (!isProd) {
    vitebuild = await vite.createServer({ root, logLevel: 'info',  server: { middlewareMode: 'ssr', watch: { usePolling: true, interval: 100 } } })
    app.use(vitebuild.middlewares)  // use vite's connect instance as middleware  
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
        template = fs.readFileSync(resolve('index.html'), 'utf-8')     // always read fresh template in dev
        template = await vitebuild.transformIndexHtml(url, template)
        render = (await vitebuild.ssrLoadModule('/src/entry-server.js')).render
      } 
      else {
        template = indexProd
        render = require('./dist/server/entry-server.js').render
      }
      const [appHtml, preloadLinks] = await render(url, manifest)
      const html = template.replace(`<!--preload-links-->`, preloadLinks).replace(`<!--app-html-->`, appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } 
    catch (e) {
      vitebuild && vitebuild.ssrFixStacktrace(e)
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
);