'use strict'
const contract = JSON.stringify(require('../.contract/mainnet.json'))

module.exports = {
  NODE_ENV: '"production"',
  LDBICON_ORIGIN: '"//cdn.lordlessio.com"',
  // LDBICON_ORIGIN: '"http://lordless.oss-cn-hongkong.aliyuncs.com"',
  OSSFOLDERPATH: 'dist',
  BACKEND_SERVER: '"//lordless.games"',
  ETHERSCANURL: '"https://etherscan.io/"',
  APPROVED_NETWORK_ID: 1,
  contract,
  tgBot: '"LORDLESS_bot"'
}
