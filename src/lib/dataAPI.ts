import { SSIConfig, SSIDataEvent, SSIDataApi, AUTH } from './type'
import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('ssi-fcdata')
export class DataClient {
  private config: SSIConfig
  private token = ''
  private url = ''
  private stream_url = ''

  constructor(config: SSIConfig) {
    this.config = config
    this.url = config.url
    this.stream_url = config.stream_url
  }

  initClient = async (): Promise<void> => {
    const { consumerID, consumerSecret } = this.config
    try {
      axios
        .post(this.url + SSIDataApi.GET_ACCESS_TOKEN, {
          consumerID,
          consumerSecret
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.token = res.data.data.accessToken
            client.initStream({
              url: this.stream_url,
              token: AUTH.AUTHORIZATION_SCHEME + ' ' + res.data.data.accessToken
            })
            client.bind(SSIDataEvent.onData, function (message: string) {
              console.log(message)
            })

            console.log('Init data ssi client successfully')
          }
        })
        .catch((err) => {
          console.log(err)
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

  registerChannel = (channel: string) => {
    try {
      client.switchChannel(channel)
    } catch (error) {
      console.log(error)
      process.exit(0)
    }
  }

  getSecurities = async (market?: string, pageIndex?: number, pageSize?: number) => {
    const url =
      this.url +
      SSIDataApi.GET_SECURITIES_LIST +
      '?lookupRequest.market=' +
      market +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize
    return this.getApi(url)
  }

  getSecuritiesDetails = async (market?: string, symbol?: string, pageIndex?: number, pageSize?: number) => {
    const url =
      this.url +
      SSIDataApi.GET_SECURITIES_DETAILs +
      '?lookupRequest.market=' +
      market +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize +
      '&lookupRequest.symbol=' +
      symbol
    return this.getApi(url)
  }

  getIndexComponents = async (indexCode?: string, pageIndex?: number, pageSize?: number) => {
    const url =
      this.url +
      SSIDataApi.GET_INDEX_COMPONENTS +
      '?lookupRequest.indexCode=' +
      indexCode +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize
    return this.getApi(url)
  }

  getIndexList = async (exchange?: string, pageIndex?: number, pageSize?: number) => {
    const url =
      this.url +
      SSIDataApi.GET_INDEX_LIST +
      '?lookupRequest.exchange=' +
      exchange +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize
    return this.getApi(url)
  }

  getDailyOhlc = async (
    symbol?: string,
    fromDate?: string,
    toDate?: string,
    pageIndex?: number,
    pageSize?: number,
    ascending?: boolean
  ) => {
    const url =
      this.url +
      SSIDataApi.GET_DAILY_OHLC +
      '?lookupRequest.symbol=' +
      symbol +
      '&lookupRequest.fromDate=' +
      fromDate +
      '&lookupRequest.toDate=' +
      toDate +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize +
      '&lookupRequest.ascending=' +
      ascending
    return this.getApi(url)
  }

  getIntradayOhlc = async (
    symbol?: string,
    fromDate?: string,
    toDate?: string,
    pageIndex?: number,
    pageSize?: number,
    ascending?: boolean
  ) => {
    const url =
      this.url +
      SSIDataApi.GET_INTRADAY_OHLC +
      '?lookupRequest.symbol=' +
      symbol +
      '&lookupRequest.fromDate=' +
      fromDate +
      '&lookupRequest.toDate=' +
      toDate +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize +
      '&lookupRequest.ascending=' +
      ascending
    return this.getApi(url)
  }

  getDailyIndex = async (
    indexId?: string,
    fromDate?: string,
    toDate?: string,
    pageIndex?: number,
    pageSize?: number,
    ascending?: boolean
  ) => {
    const url =
      this.url +
      SSIDataApi.GET_DAILY_INDEX +
      '?lookupRequest.indexId=' +
      indexId +
      '&lookupRequest.fromDate=' +
      fromDate +
      '&lookupRequest.toDate=' +
      toDate +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize +
      '&lookupRequest.ascending=' +
      ascending
    return this.getApi(url)
  }

  getDailyStockPrice = async (
    symbol?: string,
    market?: string,
    fromDate?: string,
    toDate?: string,
    pageIndex?: number,
    pageSize?: number
  ) => {
    const url =
      this.url +
      SSIDataApi.GET_DAILY_STOCKPRICE +
      '?lookupRequest.symbol=' +
      symbol +
      '&lookupRequest.fromDate=' +
      fromDate +
      '&lookupRequest.toDate=' +
      toDate +
      '&lookupRequest.pageIndex=' +
      pageIndex +
      '&lookupRequest.pageSize=' +
      pageSize +
      '&lookupRequest.market=' +
      market
    return this.getApi(url)
  }

  private getApi = (url: string) =>
    new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            accept: 'application/json',
            [AUTH.AUTHORIZATION_HEADER]: AUTH.AUTHORIZATION_SCHEME + ' ' + this.token
          }
        })
        .then((response) => {
          resolve(response.data)
        })
        .catch(reject)
    })
}
