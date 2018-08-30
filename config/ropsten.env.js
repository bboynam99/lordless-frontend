'use strict'
const merge = require('webpack-merge')
// const devEnv = require('./dev.env')
const contract = JSON.stringify(require('../.contract/ropsten.json'))

module.exports = merge({
  NODE_ENV: '"ropsten"',
  LDBICON_ORIGIN: '"http://lordless.oss-cn-hongkong.aliyuncs.com"',
  OSSFOLDERPATH: 'ropsten_dist',
  BACKEND_SERVER: '"//ropsten.lordless.games"',
  ETHERSCANURL: '"https://ropsten.etherscan.io/"',
  APPROVED_NETWORK_ID: 3,
  contract,
  tgBot: '"lordlessropstenbot"'
})
