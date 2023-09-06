import express from 'express'
import dotenv from 'dotenv'
import { SSIConfig } from './lib'
import { DataClient } from './lib/dataAPI'
import { TradingClient } from './lib/tradingAPI'
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const dataConfig: SSIConfig = {
  consumerID: process.env.DATA_CONSUMER_ID ?? '',
  consumerSecret: process.env.DATA_CONSUMER_SECRET ?? '',
  url: 'https://fc-data.ssi.com.vn/',
  stream_url: 'wss://fc-data.ssi.com.vn/'
}

const tradingConfig: SSIConfig = {
  consumerID: process.env.TRADING_CONSUMER_ID ?? '',
  consumerSecret: process.env.TRADING_CONSUMER_SECRET ?? '',
  privateKey: process.env.TRADING_PRIVATE_KEY ?? '',
  code: process.env.TRADING_PIN_CODE,
  url: 'https://fc-tradeapi.ssi.com.vn/',
  stream_url: 'wss://fc-tradehub.ssi.com.vn/'
}

const PORT = process.env.PORT || 3012

const clientData = new DataClient(dataConfig)
const clientTrading = new TradingClient(tradingConfig)

// Client data
app.get('/securities', async (req, res) => {
  const { market, pageIndex, pageSize } = req.query as any
  const response = await clientData.getSecurities(market, pageIndex, pageSize)
  res.send(response)
})

app.get('/securitiesDetails', async (req, res) => {
  const { market, symbol, pageIndex, pageSize } = req.query as any
  const response = await clientData.getSecuritiesDetails(market, symbol, pageIndex, pageSize)
  res.send(response)
})

app.get('/indexComponents', async (req, res) => {
  const { indexCode, pageIndex, pageSize } = req.query as any
  const response = await clientData.getIndexComponents(indexCode, pageIndex, pageSize)
  res.send(response)
})

app.get('/indexList', async (req, res) => {
  const { exchange, pageIndex, pageSize } = req.query as any
  const response = await clientData.getIndexList(exchange, pageIndex, pageSize)
  res.send(response)
})

app.get('/dailyOhlc', async (req, res) => {
  const { symbol, fromDate, toDate, pageIndex, pageSize, ascending } = req.query as any
  const response = await clientData.getDailyOhlc(symbol, fromDate, toDate, pageIndex, pageSize, ascending)
  res.send(response)
})

app.get('/intradayOhlc', async (req, res) => {
  const { symbol, fromDate, toDate, pageIndex, pageSize, ascending } = req.query as any
  const response = await clientData.getIntradayOhlc(symbol, fromDate, toDate, pageIndex, pageSize, ascending)
  res.send(response)
})

app.get('/dailyIndex', async (req, res) => {
  const { indexId, fromDate, toDate, pageIndex, pageSize, ascending } = req.query as any
  const response = await clientData.getDailyIndex(indexId, fromDate, toDate, pageIndex, pageSize, ascending)
  res.send(response)
})

app.get('/dailyStockPrice', async (req, res) => {
  const { symbol, market, fromDate, toDate, pageIndex, pageSize } = req.query as any
  const response = await clientData.getDailyStockPrice(symbol, market, fromDate, toDate, pageIndex, pageSize)
  res.send(response)
})

app.get('/initDataStream', async (req, res) => {
  clientData.initStream()
  res.send(`Connect stream data ssi successfully`)
})

app.get('/registerChannel', async (req, res) => {
  const { channel } = req.query as any
  clientData.registerChannel(channel)
  res.send(`Register channel ${channel} successfully`)
})

// Client Trading
app.get('/initTradingStream', async (req, res) => {
  clientTrading.initStream()
  res.send(`Connect stream trading ssi successfully`)
})
app.get('/getOrderHistory', async (req, res) => {
  const { account, startDate, endDate } = req.query as any
  const response = await clientTrading.getOrderHistory(account, startDate, endDate)
  res.send(response)
})

app.get('/getOrderBook', async (req, res) => {
  const { account } = req.query as any
  const response = await clientTrading.getOrderBook(account)
  res.send(response)
})

app.get('/getAuditOrderBook', async (req, res) => {
  const { account } = req.query as any
  const response = await clientTrading.getAuditOrderBook(account)
  res.send(response)
})

app.get('/getPosition', async (req, res) => {
  const { account } = req.query as any
  const response = await clientTrading.getPosition(account)
  res.send(response)
})

app.get('/getDerPosition', async (req, res) => {
  const { account, querySummary } = req.query as any
  const response = await clientTrading.getDerPosition(account, querySummary)
  res.send(response)
})

app.get('/getMaxBuyQty', async (req, res) => {
  const { account, instrumentID, price } = req.query as any
  const response = await clientTrading.getMaxBuyQty(account, instrumentID, Number(price))
  res.send(response)
})

app.get('/getMaxSellQty', async (req, res) => {
  const { account, instrumentID } = req.query as any
  const response = await clientTrading.getMaxSellQty(account, instrumentID)
  res.send(response)
})

app.get('/getAccountBalance', async (req, res) => {
  const { account } = req.query as any
  const response = await clientTrading.getAccountBalance(account)
  res.send(response)
})

app.get('/getDerAccountBalance', async (req, res) => {
  const { account } = req.query as any
  const response = await clientTrading.getDerAccountBalance(account)
  res.send(response)
})

app.get('/getPpmmrAccount', async (req, res) => {
  const { account } = req.query as any
  const response = await clientTrading.getPpmmrAccount(account)
  res.send(response)
})

app.post('/newOrder', async (req, res) => {
  const response = await clientTrading.newOrder(req.body)
  res.send(response)
})

app.post('/newDerOrder', async (req, res) => {
  const response = await clientTrading.newDerOrder(req.body)
  res.send(response)
})

app.post('/modifyOrder', async (req, res) => {
  const response = await clientTrading.modifyOrder(req.body)
  res.send(response)
})

app.post('/modifyDerOrder', async (req, res) => {
  const response = await clientTrading.modifyDerOrder(req.body)
  res.send(response)
})

app.post('/cancleOrder', async (req, res) => {
  const response = await clientTrading.cancleOrder(req.body)
  res.send(response)
})

app.post('/cancleDerOrder', async (req, res) => {
  const response = await clientTrading.cancleDerOrder(req.body)
  res.send(response)
})

app.listen(5000, async () => {
  await clientData.initClient()
  await clientTrading.initClient()
  console.log(`Server start at 5000 ${5000}`)
})
