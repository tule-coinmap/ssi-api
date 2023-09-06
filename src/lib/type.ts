export interface SSIConfig {
  consumerID: string
  consumerSecret: string
  privateKey?: string
  publicKey?: string
  code?: string
  url: string
  stream_url: string
}
export const AUTH = {
  AUTHORIZATION_HEADER: 'Authorization',
  AUTHORIZATION_SCHEME: 'Bearer',
  SIGNATURE_HEADER: 'X-Signature'
}
export const SSIDataEvent = {
  onData: 'onData',
  onError: 'onError',
  onConnected: 'onConnected',
  onReconnecting: 'onReconnecting',
  onReconnected: 'onReconnected'
}

export const SSITradingEvent = {
  onClientPortfolioEvent: 'clientPortfolioEvent',
  onOrderUpdate: 'orderEvent',
  onOrderMatch: 'orderMatchEvent',
  onOrderError: 'orderError',
  onError: 'onError'
}

export const SSIDataApi = {
  GET_ACCESS_TOKEN: 'api/v2/Market/AccessToken',
  GET_SECURITIES_LIST: 'api/v2/Market/Securities',
  GET_SECURITIES_DETAILs: 'api/v2/Market/SecuritiesDetails',
  GET_INDEX_COMPONENTS: 'api/v2/Market/IndexComponents',
  GET_INDEX_LIST: 'api/v2/Market/IndexList',
  GET_DAILY_OHLC: 'api/v2/Market/DailyOhlc',
  GET_INTRADAY_OHLC: 'api/v2/Market/IntradayOhlc',
  GET_DAILY_INDEX: 'api/v2/Market/DailyIndex',
  GET_DAILY_STOCKPRICE: 'api/v2/Market/DailyStockPrice'
}

export const SSITradingApi = {
  GET_ACCESS_TOKEN: 'api/v2/Trading/AccessToken',
  NEW_ORDER: 'api/v2/Trading/NewOrder',
  MODIFY_ORDER: 'api/v2/Trading/ModifyOrder',
  CANCEL_ORDER: 'api/v2/Trading/CancelOrder',
  DER_NEW_ORDER: 'api/v2/Trading/derNewOrder',
  DER_MODIFY_ORDER: 'api/v2/Trading/derModifyOrder',
  DER_CANCEL_ORDER: 'api/v2/Trading/derCancelOrder',
  GET_OTP: '/api/v2/Trading/GetOTP',
  GET_ORDER_HISTORY: 'api/v2/Trading/orderHistory',
  GET_ORDER_BOOK: 'api/v2/Trading/orderBook',
  GET_AUDIT_ORDER_BOOK: 'api/v2/Trading/auditOrderBook',
  GET_DER_POSITION: 'api/v2/Trading/derivPosition',
  GET_STOCK_POSITION: 'api/v2/Trading/stockPosition',
  GET_MAX_BUY_QUANTITY: 'api/v2/Trading/maxBuyQty',
  GET_MAX_SELL_QUANTITY: 'api/v2/Trading/maxSellQty',
  GET_ACCOUNT_BALANCE: 'api/v2/Trading/cashAcctBal',
  GET_DER_ACCOUNT_BALANCE: 'api/v2/Trading/derivAcctBal',
  GET_PPMMRACCOUNT: 'api/v2/Trading/ppmmraccount',
  SIGNALR: 'v2.0/signalr'
}

export enum Side {
  BUY = 'B',
  SELL = 'S'
}

export enum Market {
  STOCK = 'VN',
  DERIVATIVE = 'VNFE'
}

export enum OrderType {
  LO = 'LO', //  Limit Order
  ATO = 'ATO', //  At The Opening
  ATC = 'ATC', //  At The Closing
  MP = 'MP', //  Market Order (HOSE)
  MTL = 'MTL', //  Market Order
  MOK = 'MOK', //  Match Or Kill
  MAK = 'MAK', //  Match And Kill
  PLO = 'PLO', //  Plo
  GTD = 'GTD' //  Good Till Date
}

export enum StopType {
  D = 'D', // Down
  U = 'U', // Up
  V = 'V', // Trailing Up
  E = 'E', // Trailing Down
  O = 'O', // OCO
  B = 'B' // BullBear
}

export interface SSIOrder {
  account?: string
  buySell?: Side
  market?: Market
  orderType?: OrderType
  price?: number
  quantity?: number
  instrumentID?: string
  channelID?: string
  requestID?: string
  stopOrder?: boolean
  stopPrice?: number
  stopType?: StopType
  stopStep?: number
  lossStep?: number
  profitStep?: number
  code?: string
  deviceId?: string
  userAgent?: string
}
