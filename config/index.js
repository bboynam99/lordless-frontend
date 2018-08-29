'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const fs = require('fs')

const { format } = require('date-fns')
const argv = require('yargs').argv
let env = require('./prod.env')

const assetsRoot = path.resolve(__dirname, '../dist')

// 读取 dist/ossPublicPath.json 文件，获得其中的地址
// const txtPath = path.resolve(__dirname, '../dist/ossPath.json')

// console.log('===', fs.existsSync(txtPath), txtPath)
// if (!fs.existsSync(txtPath)) {
//   fs.mkdirSync(txtPath)
// }

// const oss = fs.readFileSync(txtPath)
// console.log('oss', oss)

const timeStr = `${format(new Date(), 'YYYY-MM-DD')}_${new Date().getTime()}`

if (argv.env === 'ropsten') {
  env = require('./ropsten.env')
}

const ossPublicPath = `frontend/${env.OSSFOLDERPATH}/${timeStr}/`

// 重写 ossPublic.json 内容，如果没有该文件，则创建新文件并插入内容
// fs.writeFileSync(txtPath, JSON.stringify({ _ossPublicPath: ossPublicPath, assetsRoot }))

module.exports = {
  dev: {
    env: require('./dev.env'),
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
    proxyTable: {
      '/lordless': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        pathRewrite: {'^/lordless': ''}
      },
    }
  },

  build: {
    env,
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot,
    assetsSubDirectory: 'static',
    assetsDllDirectory: 'static/dll',
    ossPublicPath,
    assetsPublicPath: `https://cdn.lordlessio.com/${ossPublicPath}`,

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
