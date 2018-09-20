'use strict'

import store from '@/store'
import { getNetwork, getCoinbase, getBalance, getGasPrice } from './utils'
import { monitorWeb3 } from './monitorWeb3'
import { actionTypes } from '@/store/types'
// 初始化 web3js
export const initWeb3 = async (callback) => {
  const res = await checkWeb3()
  console.log('init web3 web3Opt:', res)
  // 注册 web3 状态
  await store.dispatch(`web3/${actionTypes.WEB3_SET_WEB3_INFO}`, res)

  // 注册合约
  store.dispatch(`contract/${actionTypes.CONTRACT_INIT_INSTANCE}`)

  if (res.error) return callback ? callback(res) : res

  // 监听 web3 动态
  monitorWeb3()

  return callback ? callback(res) : res
}

const checkWeb3 = async () => {
  const res = {
    error: null,
    web3js: { default: true },
    isInjected: false,
    balance: 0,
    gasPrice: 0,
    networkId: '',
    coinbase: '',
    address: ''
  }

  // check web3 instance
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    const web3js = new Web3(web3.currentProvider)

    res.web3js = web3js
    res.isInjected = web3js.isConnected()
    res.address = web3js.eth.defaultAccount

    const currentAddress = window.localStorage.getItem('currentAddress')
    if (web3js.eth.defaultAccount && currentAddress !== web3js.eth.defaultAccount) {
      window.localStorage.setItem('currentAddress', web3js.eth.defaultAccount)
      // 获取本地用户
      store.dispatch(`user/${actionTypes.USER_SET_USER_BY_TOKEN}`)
    }

    // 测试使用
    // window.web3js = web3js
  } else {
    res.web3js = { default: false }
    res.error = 'Unable to connect to Web3'
    return res
    // console.log('No web3? You should consider trying MetaMask!')
    // // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  console.time('net word')
  // check network
  getNetwork(res.web3js)
    .then(nRes => {
      if (nRes.error) {
        res.error = nRes.error
        return res
      } else {
        res.networkId = nRes.networkId
      }
    })
  // const networkRes = await getNetwork(res.web3js)
  console.timeEnd('net word')
  // if (networkRes.error) {
  //   res.error = networkRes.error
  //   return res
  // } else {
  //   res.networkId = networkRes.networkId
  // }

  console.time('coinbaseRes word')
  // check coinbase
  getCoinbase(res.web3js)
    .then(cRes => {
      if (cRes.error) {
        res.error = cRes.error
        return res
      } else {
        res.coinbase = cRes.coinbase
        res.address = res.address || res.web3js.eth.defaultAccount
      }
    })
  // const coinbaseRes = await getCoinbase(res.web3js)
  console.timeEnd('coinbaseRes word')
  // if (coinbaseRes.error) {
  //   res.error = coinbaseRes.error
  //   return res
  // } else {
  //   res.coinbase = coinbaseRes.coinbase
  //   res.address = res.address || res.web3js.eth.defaultAccount
  // }

  console.time('gasPriceRes word')
  // check gasPrice
  getGasPrice(res.web3js)
    .then(gRes => {
      res.gasPrice = gRes.gasPrice
    })
  // const gasPriceRes = await getGasPrice(res.web3js)
  console.timeEnd('gasPriceRes word')
  // res.gasPrice = gasPriceRes.gasPrice

  console.time('balance word')
  // check balance
  getBalance(res.web3js, res.address)
    .then(bRes => {
      res.balance = bRes.balance
    })
  // const balanceRes = await getBalance(res.web3js, res.address)
  // res.balance = balanceRes.balance
  console.timeEnd('balance word')

  return res
}
