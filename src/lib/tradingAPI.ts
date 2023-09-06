import { SSIConfig, AUTH, SSITradingApi, SSIDataEvent, SSITradingEvent, SSIOrder } from './type'
import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('ssi-fctrading')

export class TradingClient {
  private config: SSIConfig
  private token = ''
  private url = ''
  private stream_url = ''
  private deviceId = ''
  private userAgent = ''

  constructor(config: SSIConfig) {
    this.config = config
    this.url = config.url
    this.stream_url = config.stream_url
  }

  initClient = async (): Promise<void> => {
    const { consumerID, consumerSecret, code } = this.config
    try {
      axios
        .post(this.url + SSITradingApi.GET_ACCESS_TOKEN, {
          consumerID,
          consumerSecret,
          twoFactorType: 0, // 0 => PIN, 1 => OTP
          code,
          isSave: true
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.token = res.data.data.accessToken
            this.deviceId = client.getDeviceId()
            this.userAgent = client.getUserAgent()
            client.initStream({
              url: this.stream_url,
              access_token: res.data.data.accessToken,
              notify_id: 0
            })
            client.bind(SSITradingEvent.onError, function (e: any, data: any) {
              console.log(e + ': ')
              console.log(data)
            })
            client.bind(SSITradingEvent.onOrderUpdate, function (e: any, data: any) {
              console.log(e + ': ')
              console.log(JSON.stringify(data))
            })
            client.bind(SSITradingEvent.onOrderError, function (e: any, data: any) {
              console.log(e + ': ')
              console.log(JSON.stringify(data))
            })
            client.bind(SSITradingEvent.onClientPortfolioEvent, function (e: any, data: any) {
              console.log(e + ': ')
              console.log(JSON.stringify(data))
            })
            client.bind(SSITradingEvent.onOrderMatch, function (e: any, data: any) {
              console.log(e + ': ')
              console.log(JSON.stringify(data))
            })
            console.log('Init trading ssi client successfully')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
      process.exit(0)
    }
  }

  initStream = () => {
    try {
      client.start()
    } catch (error) {
      console.log(error)
      process.exit(0)
    }
  }

  getOtp = async () => {
    const { consumerID, consumerSecret } = this.config
    const request = { consumerID, consumerSecret }
    return this.handleApi('get', SSITradingApi.GET_OTP, request)
  }

  newDerOrder = async (order: SSIOrder) => {
    order.requestID = this.random() + ''
    order.deviceId = this.deviceId
    order.userAgent = this.userAgent
    order.code = this.config.code

    return this.handleApi('post', SSITradingApi.DER_NEW_ORDER, order)
  }

  newOrder = async (order: SSIOrder) => {
    order.requestID = this.random() + ''
    order.deviceId = this.deviceId
    order.userAgent = this.userAgent
    order.code = this.config.code

    return this.handleApi('post', SSITradingApi.NEW_ORDER, order)
  }

  modifyDerOrder = async (order: SSIOrder) => {
    order.requestID = this.random() + ''
    order.deviceId = this.deviceId
    order.userAgent = this.userAgent
    order.code = this.config.code

    return this.handleApi('post', SSITradingApi.DER_MODIFY_ORDER, order)
  }

  modifyOrder = async (order: SSIOrder) => {
    order.requestID = this.random() + ''
    order.deviceId = this.deviceId
    order.userAgent = this.userAgent
    order.code = this.config.code

    return this.handleApi('post', SSITradingApi.MODIFY_ORDER, order)
  }

  cancleDerOrder = async (order: SSIOrder) => {
    order.requestID = this.random() + ''
    order.deviceId = this.deviceId
    order.userAgent = this.userAgent
    order.code = this.config.code

    return this.handleApi('post', SSITradingApi.DER_CANCEL_ORDER, order)
  }

  cancleOrder = async (order: SSIOrder) => {
    order.requestID = this.random() + ''
    order.deviceId = this.deviceId
    order.userAgent = this.userAgent
    order.code = this.config.code

    return this.handleApi('post', SSITradingApi.CANCEL_ORDER, order)
  }

  getOrderHistory = async (account: string, startDate: string, endDate: string) => {
    const request = { account, startDate, endDate }
    return this.handleApi('get', SSITradingApi.GET_ORDER_HISTORY, request)
  }

  getOrderBook = async (account: string) => {
    const request = { account }
    return this.handleApi('get', SSITradingApi.GET_ORDER_BOOK, request)
  }

  getAuditOrderBook = async (account: string) => {
    const request = { account }
    return this.handleApi('get', SSITradingApi.GET_AUDIT_ORDER_BOOK, request)
  }

  getPosition = async (account: string) => {
    const request = { account }
    return this.handleApi('get', SSITradingApi.GET_STOCK_POSITION, request)
  }

  getDerPosition = async (account: string, querySummary: true) => {
    const request = { account, querySummary }
    return this.handleApi('get', SSITradingApi.GET_DER_POSITION, request)
  }

  getMaxBuyQty = async (account: string, instrumentID: string, price: number) => {
    const request = { account, instrumentID, price }
    return this.handleApi('get', SSITradingApi.GET_MAX_BUY_QUANTITY, request)
  }

  getMaxSellQty = async (account: string, instrumentID: string) => {
    const request = { account, instrumentID }
    return this.handleApi('get', SSITradingApi.GET_MAX_SELL_QUANTITY, request)
  }

  getAccountBalance = async (account: string) => {
    const request = { account }
    return this.handleApi('get', SSITradingApi.GET_ACCOUNT_BALANCE, request)
  }

  getDerAccountBalance = async (account: string) => {
    const request = { account }
    return this.handleApi('get', SSITradingApi.GET_DER_ACCOUNT_BALANCE, request)
  }

  getPpmmrAccount = async (account: string) => {
    const request = { account }
    return this.handleApi('get', SSITradingApi.GET_PPMMRACCOUNT, request)
  }

  private random = () => {
    return Math.floor(Math.random() * 999999)
  }

  private handleApi = (method: 'get' | 'post', url: string, data: any) =>
    new Promise((resolve, reject) => {
      if (method === 'get') {
        axios
          .get(this.url + url, {
            headers: {
              [AUTH.AUTHORIZATION_HEADER]: AUTH.AUTHORIZATION_SCHEME + ' ' + this.token
            },
            params: data
          })
          .then((response) => {
            resolve(response.data)
          })
          .catch(reject)
      } else {
        axios
          .post(this.url + url, data, {
            headers: {
              [AUTH.SIGNATURE_HEADER]: client.sign(JSON.stringify(data), this.config.privateKey),
              [AUTH.AUTHORIZATION_HEADER]: AUTH.AUTHORIZATION_SCHEME + ' ' + this.token
            }
          })
          .then((response) => {
            resolve(response.data)
          })
          .catch(reject)
      }
    })
}
