# Installation
#### From npm (most stable)
``` javascript
npm install tule-coinmap/ssi-fcdata tule-coinmap/ssi-fctrading
```

# Getting started
Get `ConsumerID` ,  `ConsumerSecret`  ,  `publicKey` and `publicKey` from [iBoard](https://iboard.ssi.com.vn/support/api-service/management)  *(note: config of fcdata and fctrading is different)*
<br/>
<br/>
All api of FCData require header `Authorization: Bearer <accessToken>`. So initClient will get accessToken via config and use to [query data](#Query) or [streaming](#Streaming-Data)
```javascript
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
  code: process.env.TRADING_PIN_CODE, // pin code
  url: 'https://fc-tradeapi.ssi.com.vn/',
  stream_url: 'wss://fc-tradehub.ssi.com.vn/'
}

const PORT = process.env.PORT || 3012

const clientData = new DataClient(dataConfig)
const clientTrading = new TradingClient(tradingConfig)

app.listen(PORT, async () => {
  await clientData.initClient()
  await clientTrading.initClient()
  console.log(`Server start at port ${PORT}`)
})
```
# API
 - [Data API](#Data-API)
 - [Trading API](#Trading-API)
   
## Data API
 - [Get securities list](#Get-securities-list)
 - [Get securities details](#Get-securities-details)
 - [Get index components](#Get-index-components)
 - [Get index list](#Get-index-list)
 - [Get daily ohlc](#Get-daily-ohlc)
 - [Get intraday ohlc](#Get-intraday-ohlc)
 - [Get daily index](#Get-daily-index)
 - [Get daily stock price](#Get-daily-stock-price)
 - [Stream data](#Stream-data)
<br/>

### Get securities list
``` javascript
 /** Request
   * market: HOSE/HNX/UPCOM/DER (If not specify then return all market)
   * symbol: HPG, VIC,... (If not specify then returns all market)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   */
 
await clientData.getSecurities(market, pageIndex, pageSize)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Market: Stock exchange
   * Symbol: Ticker of the securities
   * StockName: Stockname in Vietnamese
   * StockEnName: Stockname in English
   */
{
    "data": [
        {
            "Market": "HOSE",
            "Symbol": "BHN",
            "StockName": "TCTCP BIA RUOU NGK HA NOI",
            "StockEnName": "Hanoi Beer Alcohol and Beverage Joint Stock Corporation"
        },
        {
            "Market": "HOSE",
            "Symbol": "BIC",
            "StockName": "TCTCP BAO HIEM NHDTPTVN",
            "StockEnName": "BIDV Insurance Corporation"
        },
        ...
    ],
    "message": "Success",
    "status": "Success",
    "totalRecord": 611
}
```
</details>
<br/>

### Get securities details
``` javascript
 /** Request
   * market: HOSE/HNX/UPCOM/DER (If not specify then return all market)
   * symbol: HPG, VIC,... (If not specify then returns all market)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   */
 
await clientData.getSecuritiesDetails(market, symbol, pageIndex, pageSize)
```
<details>
 <summary>View Response</summary>
 
```js
/** Response
   * RType: A fixed value to identify the value of this record for equity information
   * ReportDate: Date & time of the data record (dd/MM/yyyy HH:mm:ss)
   * TotalNoSym: Total number of symbol returned
   * Isin: ISIN code of the securities
   * Symbol: The local trading code of the equity listed in the exchanges
   * SymbolName: Name of the securities
   * SymbolEngName: Name in English
   * SecType: The type of equity
   *    + ST: stock
   *    + CW: covered warrant
   *    + FU: futures
   *    + EF: ETF
   *    + BO: BOND
   *    + OF: OEF
   *    + MF: Mutual Fund
   * MarketID: The market of the securities (HOSE | HNX | HNXBOND | UPCOM | DER)
   * Exchange: The ID of the corresponding Exchange where the equity is trading (HOSE | HNX)
   * Issuer: Issuer of the security
   * LotSize: Trading lot size of the security
   * IssueDate
   * MaturityDate
   * FirstTradingDate
   * LastTradingDate 
   * ContractMultiplier
   * SettlMethod: Settlement method of the securities (C: cash | P: physical)
   * Underlying 
   * PutOrCall: Option Type (P: put | C: call)
   * ExercisePrice: Exercise price. Used for Options, CW
   * ExerciseStyle: Exercise Style. Used for CW, Options (E: European | A: American) Only available with CoverWarrant
   * ExcerciseRatio: Exercise ratio, used for CW, Options
   * ListedShare: Number of listed shares 
   * TickPrice1, TickPrice2, TickPrice3, TickPrice4: Starting price range 1, 2, 3, 4 for tick rule
   * TickIncrement1, TickIncrement2, TickIncrement3, TickIncrement4: Tick increasement for price range 1, 2, 3, 4 for tick rule
   */
{
  "data": [
    {
      "RType": "y",
      "ReportDate": "28/08/2023",
      "TotalNoSym": "1",
      "RepeatedInfo": [
        {
          "Isin": null,
          "Symbol": "HPG",
          "SymbolName": "CTCP TAP DOAN HOA PHAT",
          "SymbolEngName": "Hoa Phat Group Joint Stock Company",
          "SecType": "S",
          "MarketId": "HOSE",
          "Exchange": "HOSE",
          "Issuer": null,
          "LotSize": "100",
          "IssueDate": "",
          "MaturityDate": "",
          "FirstTradingDate": "",
          "LastTradingDate": "",
          "ContractMultiplier": "0",
          "SettlMethod": "C",
          "Underlying": null,
          "PutOrCall": null,
          "ExercisePrice": "0",
          "ExerciseStyle": "",
          "ExcerciseRatio": "0",
          "ListedShare": "5814785700",
          "TickPrice1": "1",
          "TickIncrement1": "10",
          "TickPrice2": "10000",
          "TickIncrement2": "50",
          "TickPrice3": "50000",
          "TickIncrement3": "100",
          "TickPrice4": null,
          "TickIncrement4": null
        }
      ]
    }
  ],
  "message": "Success",
  "status": "Success",
  "totalRecord": 1
}
```
</details>
<br/>

### Get index components
``` javascript
 /** Request
   * market: Input Index Code to get consituent stocks
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   */
 
await clientData.getIndexComponents(indexCode, pageIndex, pageSize)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * IndexCode
   * IndexName
   * Exchange: Exchange of the Index
   * TotalSymbolNo: Total number of symbols in the Index
   * ISIN: ISIN Code of the security
   * StockSymbol: Ticker code of the security
   */
{
  "data": [
    {
      "IndexCode": "VN30",
      "IndexName": "VN30",
      "Exchange": "HOSE",
      "TotalSymbolNo": "30",
      "IndexComponent": [
        {
          "Isin": "ACB",
          "StockSymbol": "ACB"
        },
        {
          "Isin": "BCM",
          "StockSymbol": "BCM"
        },
        {
          "Isin": "BID",
          "StockSymbol": "BID"
        },
        ...
      ]
    }
  ],
  "message": "Success",
  "status": "Success",
  "totalRecord": 1
}
```
</details>
<br/>

### Get index list
``` javascript
 /** Request
   * Exchange: Input Exchange code to get the list of indexes for that Exchange (if not specify then returns all exchanges)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   */
 
await clientData.getIndexList(exchange, pageIndex, pageSize)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Indexcode
   * IndexName
   * Exchange: Exchange of the Index
   */
{
  "data": [
    {
      "IndexCode": "HNX30",
      "IndexName": "HNX30",
      "Exchange": "HNX"
    },
    {
      "IndexCode": "HNXIndex",
      "IndexName": "HNXIndex",
      "Exchange": "HNX"
    },
    {
      "IndexCode": "HNXUpcomIndex",
      "IndexName": "HNXUpcomIndex",
      "Exchange": "HNX"
    }
  ],
  "message": "Success",
  "status": "Success",
  "totalRecord": 3
}
```
</details>
<br/>

### Get daily ohlc
``` javascript
 /** Request
   * Symbol: Symbol of stock, indexcode, derivatives
   * fromDate: If not specify, get today date
   * toDate: If not specify, get today date (Max range 30 days)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   * ascending: true/false
   */
 
await clientData.getDailyOhlc(symbol, fromDate, toDate, pageIndex, pageSize, ascending)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Symbol: Index ID/Stock Symbol
   * Market: Market of the symbol
   * Trading Date
   * Time
   * Open
   * High
   * Low
   * Close
   * Volume: Total normal matched volume
   * Value: Total normal matched value
   */
{
  "data": [
    {
      "Symbol": "SSI",
      "Market": "HOSE",
      "TradingDate": "07/08/2023",
      "Time": null,
      "Open": "29600",
      "High": "29950",
      "Low": "29400",
      "Close": "29700",
      "Volume": "15093300",
      "Value": "447494769999.9990"
    },
    {
      "Symbol": "SSI",
      "Market": "HOSE",
      "TradingDate": "08/08/2023",
      "Time": null,
      "Open": "29850",
      "High": "29850",
      "Low": "29000",
      "Close": "29100",
      "Volume": "11628700",
      "Value": "341664350000"
    }
  ],
  "message": "Success",
  "status": "Success",
  "totalRecord": 2
}
```
</details>
<br/>

### Get intraday ohlc
``` javascript
 /** Request
   * Symbol: Symbol of stock, indexcode, derivatives
   * fromDate: If not specify, get today date
   * toDate: If not specify, get today date (Max range 30 days)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   * ascending: true/false
   */
 
await clientData.getIntradayOhlc(symbol, fromDate, toDate, pageIndex, pageSize, ascending)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Symbol: Index ID/Stock Symbol
   * Trading Date
   * Time
   * Open
   * High
   * Low
   * Close
   * Volume: Total normal matched volume
   * Value: Total normal matched value
   */
{
  "data": [
    {
      "Symbol": "SSI",
      "Value": "29550",
      "TradingDate": "07/08/2023",
      "Time": "09:15:56",
      "Open": "29600",
      "High": "29600",
      "Low": "29550",
      "Close": "29550",
      "Volume": "421100"
    },
    {
      "Symbol": "SSI",
      "Value": "29500",
      "TradingDate": "07/08/2023",
      "Time": "09:16:56",
      "Open": "29550",
      "High": "29550",
      "Low": "29500",
      "Close": "29500",
      "Volume": "34500"
    },
    {
      "Symbol": "SSI",
      "Value": "29450",
      "TradingDate": "07/08/2023",
      "Time": "09:17:54",
      "Open": "29500",
      "High": "29500",
      "Low": "29450",
      "Close": "29450",
      "Volume": "11700"
    },
    ...
  ],
  "message": "Success",
  "status": "Success",
  "totalRecord": 453
}
```
</details>
<br/>

### Get daily index
``` javascript
 /** Request
   * Indexcode: Index ID (Valid values can be queried by api getIndexList)
   * fromDate: If not specify, get today date
   * toDate: If not specify, get today date (Max range 30 days)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   * ascending: true/false
   */
 
await clientData.getDailyIndex(indexId, fromDate, toDate, pageIndex, pageSize, ascending)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Indexcode: Index ID
   * IndexValue: Value of the index
   * Trading Date
   * Time
   * Change: Change of index
   * RatioChange: Ratio of Change
   * TotalTrade: Tổng số lệnh khớp (cả thông thường và thỏa thuận)
   * Totalmatchvol: Tổng matched quantity of normal orders
   * Totalmatchval: Tổng matched value of normal orders
   * TypeIndex: Type of index
   * IndexName
   * Advances: Total number of symbols having price increase
   * Nochanges: Total number of symbols having price unchange
   * Declines: Total number of symbols having price decrease
   * Ceiling: Total number of symbols having last price = ceiling price
   * Floor: Total number of symbols having last price = floor price
   * Totaldealvol: Total matched quantity of puthrough orders
   * Totaldealval: Total matched value of putthrough orders
   * Totalvol: Total matched quantity of both normal and putthrough
   * Totalval: Total matched value of both normal and putthrough
   * TradingSession: Trading session
            + ATO
            + LO: continuous
            + ATC
            + PT: puttthrough
            + BREAK: lunch break
            + C: market close
            + H: market halted
   * Market: HOSE | HNX | UPCOM | DER | BOND
   * Exchange: HOSE | HNX
   */
{
  "data": [
    {
      "IndexId": "HNXIndex",
      "IndexValue": "245.68",
      "TradingDate": "07/08/2023",
      "Time": null,
      "Change": "3.27",
      "RatioChange": "1.35",
      "TotalTrade": "0",
      "TotalMatchVol": "120018900",
      "TotalMatchVal": "1951590290000",
      "TypeIndex": null,
      "IndexName": "HNXIndex",
      "Advances": "125",
      "NoChanges": "141",
      "Declines": "61",
      "Ceilings": "13",
      "Floors": "3",
      "TotalDealVol": "0",
      "TotalDealVal": "0",
      "TotalVol": "120018900",
      "TotalVal": "1951590290000",
      "TradingSession": "C"
    },
    {
      "IndexId": "HNXIndex",
      "IndexValue": "246.07",
      "TradingDate": "08/08/2023",
      "Time": null,
      "Change": "0.38",
      "RatioChange": "0.16",
      "TotalTrade": "0",
      "TotalMatchVol": "158279300",
      "TotalMatchVal": "2631726530000",
      "TypeIndex": null,
      "IndexName": "HNXIndex",
      "Advances": "106",
      "NoChanges": "140",
      "Declines": "81",
      "Ceilings": "10",
      "Floors": "3",
      "TotalDealVol": "0",
      "TotalDealVal": "0",
      "TotalVol": "158279300",
      "TotalVal": "2631726530000",
      "TradingSession": "C"
    }
  ],
  "message": "Success",
  "status": "Success",
  "totalRecord": 2
}
```
</details>
<br/>

### Get daily stock price
``` javascript
 /** Request
   * Symbol: Symbol of the security (Include Stock, CW and Derivatives)
   * fromDate: If not specify, get today date
   * toDate: If not specify, get today date (Max range 30 days)
   * pageIndex: from 1 to 10 (default 1)
   * pageSize: 10; 20; 50; 100; 1000 (default 10)
   * market: Identify what market for this symbol (HOSE | HNX | UPCOM | DER | BOND)
   */
 
await clientData.getDailyStockPrice(symbol, market, fromDate, toDate, pageIndex, pageSize)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Tradingdate
   * Symbol
   * Pricechange: Price change
   * Perpricechange: Per price change
   * Ceilingprice: Ceiling price
   * Floorprice: Floor price
   * Refprice: Reference Price
   * Openprice: Open price
   * Highestprice: Highest price
   * Lowestprice: Lowest price
   * Closeprice: Close price
   * Averageprice: average price
   * Closepriceadjusted: Close price adjusted
   * Totalmatchvol: Total match volume
   * Totalmatchval: Total match value
   * Totaldealval: Total matched value of putthrough orders
   * Totaldealvol: Total matched quantity of puthrough orders
   * Foreignbuyvoltotal: Total foreign buy volume
   * Foreigncurrentroom: Foreign current room
   * Foreignsellvoltotal: Total foreign sell volume
   * Foreignbuyvaltotal: Total foreign buy volume
   * Toreignsellvaltotal: Total foreign sell value
   * Totalbuytrade: Total buy trade
   * Totalbuytradevol: Total buy trade volume
   * Totalselltrade: Total sell trade
   * Totalselltradevol: Total sell trade volume
   * Netforeivol: Net volume after netoff from foreign Sell volume to Foreign Buy volume
   * Netforeignval: Net value after netoff from Sell value to Foreign Buy value
   * Totaltradedvol: Total traded vol includes: matched, put and odd
   * Totaltradedvalue: Total traded value includes: matched, put and odd
   */
"dataList": [
 {
 "tradingdate": "04/05/2020",
 "pricechange": "-300",
 "perpricechange": "-2.30",
 "ceilingprice": "13900",
 "floorprice": "12100",
 "refprice": "13000",
 "openprice": "12900",
 "highestprice": "13000",
 "lowestprice": "12700",
 "closeprice": "12700",
 "averageprice": "12816",
 "closepriceadjusted": "12700",
 "totalmatchvol": "2180310",
 "totalmatchval": "27943000000",
 "totaldealval": "0",
 "totaldealvol": "0",
 "foreignbuyvoltotal": "25310",
 "foreigncurrentroom": "253974102",
 "foreignsellvoltotal": "1117250",
 "foreignbuyvaltotal": "322702500",
 "foreignsellvaltotal": "14244937500",
 "totalbuytrade": "0",
 "totalbuytradevol": "0",
 "totalselltrade": "0",
 "totalselltradevol": "0",
 "netbuysellvol": "-1091940",
 "netbuysellval": "-13922235000",
 "totaltradedvol": "2180310",
 "totaltradedvalue": "27943000000",
 "symbol": "SSI",
 "time": ""
 }
 ],
 "message": "SUCCESS",
 "status": "SUCCESS",
 "totalrecord": 1,
 "stockpriceresponse": {
 }
}
```
</details>
<br/>

# Stream data
``` javascript
// Init stream data (only one)
clientData.initStream()
```
 - [Securities Status (F)](#Securities-status)
 - [Quote Data (X-QUOTE)](#Quote-data)
 - [Trade Data (X-TRADE)](#Trade-data)
 - [Foreign Room Data (R)](#Foreign-room-data)
 - [Index Data (MI)](#Index-data)
 - [Realtime Bars (B)](#Realtime-bars)

### Securities status
``` javascript
// Channel: F:symbols
// Example: F:SSI or F:SSI-VIC or F:ALL
const channel = 'F:SSI'
clientData.registerChannel(channel)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Rtype: Identify of type of data stream
   * MarketId: HOSE | HNX | HNXBOND | UPCOM | DER
   * TradingDate: Date & time of data record (DD/MM/YYYY)
   * Time: HH:MM:SSSS
   * Symbol: Ticker of the securities
   * Exchange: HOSE | HNX
   * TradingSession: Session status of the market
            - ATO: Opening Call Auction
            - LO: Continuous Trading
            - ATC: Closing All Auction
            - PT: Putthrough
            - C: Market Close
            - BREAK: Lunch Break
            - HALT: Market Halt
   * TradingStatus: Status of trading
            - N: Normal - Giao dịch bình thường
            - D: Delisted - Bị hủy niêm yết
            - H: Halt - Tạm dừng giao dịch giữa phiên
            - S: Suspend - Ngừng giao dịch
            - NL: New List - Niêm yết mới
            - ND: Near delisted - Sắp hủy niêm yết
            - ST: Special Trading - Giao dịch đặc biệt
            - SA: Suspend A - Bị ngưng giao dịch khớp lệnh
            - SP: Suspend PT - Ngừng giao dịch khớp lệnh thỏa thuận
   */
{
  datatype: "F",
  content: {
    "Rtype": "F",
    "MarketId": "HNX",
    "TradingDate": "04/05/2020",
    "Time": "15: 00: 16",
    "Symbol": "DPS",
    "TradingSession": "C",
    "TradingStatus": "NT",
    "Exchange": "HNX"
  }
}
```
</details>
<br/>

### Quote data
``` javascript
// Channel: X-QUOTE:symbols 
// Example: X-QUOTE:SSI or X-QUOTE:SSI-VIC or X:ALL
const channel = 'X-QUOTE:SSI'
clientData.registerChannel(channel)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Rtype: Identify of type of data stream
   * TradingDate: Date & time of data record (DD/MM/YYYY)
   * Time: HH:MM:SSSS
   * ISIN: ISIN code
   * Symbol: symbol of stock
   * Ceiling: ceiling price
   * Floor: floor price
   * RefPrice: reference price
   * Open: open price of the equity
   * Close: close price of the equity
   * High: highest matched price in the date of report
   * Low: lowest matched price in the date of report
   * Avg: average price of the security
   * PriorVal: The closing price of previous trading day of the report date
   * LastPrice: latest matched price
   * Change: change
   * RatioChange: ratio change
   * EstMatchedPrice: estimate matched price
   * LastVol: latest matched  volume
   * TotalVal: total matched value from market opening till the reporting time
   * TotalVol: total matched volume from market opening till the reporting time
   * Exchange: HOSE | HNX
   * MarketId: HOSE | HNX | HNXBOND | UPCOM | DER
   * TradingSession: Session status of the market
            - ATO: Opening Call Auction
            - LO: Continuous Trading
            - ATC: Closing All Auction
            - PT: Putthrough
            - C: Market Close
            - BREAK: Lunch Break
            - HALT: Market Halt
   * TradingStatus: Status of trading
            - N: Normal - Giao dịch bình thường
            - D: Delisted - Bị hủy niêm yết
            - H: Halt - Tạm dừng giao dịch giữa phiên
            - S: Suspend - Ngừng giao dịch
            - NL: New List - Niêm yết mới
            - ND: Near delisted - Sắp hủy niêm yết
            - ST: Special Trading - Giao dịch đặc biệt
            - SA: Suspend A - Bị ngưng giao dịch khớp lệnh
            - SP: Suspend PT - Ngừng giao dịch khớp lệnh thỏa thuận
   * BidPrice1: best bid price 1
   * BidVol1: best bid volume 1
   * AskPrice1: best aks price 1
   * AskVol1: best ask volume 1
    ....
   * BidPrice10: best bid price 10
   * BidVol10: best bid volume 10
   * AskPrice10: best aks price 10
   * AskVol10: best ask volume 10
   */
{
  "DataType": "Quote",
  "Content": {
    {
      “RType: ”Quote”,
      "TradingDate": "06/04/2021",
      "TradingTime": "08:54:52",
      "Exchange": "DERIVATIVES",
      "Symbol": "VN30F2104",
      "StockNo": "1138",
      "AskPrice1": 0.0,
      "AskPrice2": 1252.0,
      "AskPrice3": 1254.0,
      "AskPrice4": 1257.0,
      "AskPrice5": 1257.5,
      "AskPrice6": 1258.6,
      "AskPrice7": 1259.0,
      "AskPrice8": 1259.4,
      "AskPrie9": 1259.5,
      "AskPrice10": 1259.8,
      "AskVol1": "140",
      "AskVol2": "1",
      "AskVol3": "1",
      "AskVol4": "6",
      "AskVol5": "20",
      "AskVol6": "10",
      "AskVol7": "8",
      "AskVol8": "2",
      "AskVol9": "6",
      "AskVol10": "2",
      "BidPrice1": 0.0,
      "BidPrice2": 1344.9,
      "BidPrice3": 1265.0,
      "BidPrice4": 1261.4,
      "BidPrice5": 1260.1,
      "BidPrice6": 1260.0,
      "BidPrice7": 1259.4,
      "BidPrice8": 1258.5,
      "BidPrice9": 1258.0,
      "BidPrice10": 1257.1,
      "BidVol1": "150",
      "BidVol2": "18",
      "BidVol3": "1",
      "BidVol4": "1",
      "BidVol5": "1",
      "BidVol6": "33",
      "BidVol7": "1",
      "BidVol8": "1",
      "BidVol9": "10",
      "BidVol10": "4",
      "StockType": "Future"
    }
  }
}
```
</details>
<br/>

### Trade data
``` javascript
// Channel: X-TRADE:symbols 
// Example: X-TRADE:SSI or X-TRADE:SSI-VIC or X:ALL
const channel = 'X-TRADE:SSI'
clientData.registerChannel(channel)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Rtype: Identify of type of data stream
   * TradingDate: Date & time of data record (DD/MM/YYYY)
   * Time: HH:MM:SSSS
   * ISIN: ISIN code
   * Symbol: symbol of stock
   * Ceiling: ceiling price
   * Floor: floor price
   * RefPrice: reference price
   * Open: open price of the equity
   * Close: close price of the equity
   * High: highest matched price in the date of report
   * Low: lowest matched price in the date of report
   * Avg: average price of the security
   * PriorVal: The closing price of previous trading day of the report date
   * LastPrice: latest matched price
   * Change: change
   * RatioChange: ratio change
   * EstMatchedPrice: estimate matched price
   * LastVol: latest matched  volume
   * TotalVal: total matched value from market opening till the reporting time
   * TotalVol: total matched volume from market opening till the reporting time
   * Exchange: HOSE | HNX
   * MarketId: HOSE | HNX | HNXBOND | UPCOM | DER
   * TradingSession: Session status of the market
            - ATO: Opening Call Auction
            - LO: Continuous Trading
            - ATC: Closing All Auction
            - PT: Putthrough
            - C: Market Close
            - BREAK: Lunch Break
            - HALT: Market Halt
   * TradingStatus: Status of trading
            - N: Normal - Giao dịch bình thường
            - D: Delisted - Bị hủy niêm yết
            - H: Halt - Tạm dừng giao dịch giữa phiên
            - S: Suspend - Ngừng giao dịch
            - NL: New List - Niêm yết mới
            - ND: Near delisted - Sắp hủy niêm yết
            - ST: Special Trading - Giao dịch đặc biệt
            - SA: Suspend A - Bị ngưng giao dịch khớp lệnh
            - SP: Suspend PT - Ngừng giao dịch khớp lệnh thỏa thuận
   * BidPrice1: best bid price 1
   * BidVol1: best bid volume 1
   * AskPrice1: best aks price 1
   * AskVol1: best ask volume 1
    ....
   * BidPrice10: best bid price 10
   * BidVol10: best bid volume 10
   * AskPrice10: best aks price 10
   * AskVol10: best ask volume 10
   */
{
  datatype: 'Trade',
  content: {
    "RType": "Trade",
    "TradingDate": "04/05/2020",
    "Time": "14:46:51",
    "ISin": null,
    "Symbol": "SSI",
    "Ceiling": 13900,
    "Floor": 12100,
    "RefPrice": 13000,
    "Open": 12900,
    "Close": 12700,
    "High": 13000,
    "Low": 12700,
    "AvgPrice": 12816,
    "PriorVal": 13000,
    "LastPrice": 12700,
    "LastVol": 2180310,
    "TotalVal": 27943000000,
    "TotalVol": 2180310,
    "MarketId": "HOSE",
    "Exchange": "HOSE",
    "BidPrice1": 12650,
    "BidVol1": 37330,
    "BidPrice2": 12600,
    "BidVol2": 50770,
    "BidPrice3": 12550,
    "BidVol3": 2720,
    "BidPrice4": 0,
    "BidVol4": 0,
    "BidPrice5": 0,
    "BidVol5": 0,
    "BidPrice6": 0,
    "BidVol6": 0,
    "BidPrice7": 0,
    "BidVol7": 0,
    "BidPrice8": 0,
    "BidVol8": 0,
    "BidPrice9": 0,
    "BidVol9": 0,
    "BidPrice10": 0,
    "BidVol10": 0,
    "AskPrice1": 12700,
    "AskVol1": 51670,
    "AskPrice2": 12750,
    "AskVol2": 18260,
    "AskPrice3": 12800,
    "AskVol3": 47210,
    "AskPrice4": 0,
    "AskVol4": 0,
    "AskPrice5": 0,
    "AskVol5": 0,
    "AskPrice6": 0,
    "AskVol6": 0,
    "AskPrice7 ": 0,
    "AskVol7": 0,
    "AskPrice8": 0,
    "AskVol8": 0,
    "AskPrice9": 0,
    "AskVol9": 0,
    "AskPrice10": 0,
    "AskVol10": 0,
    "TradingSession": "ATC",
    "TradingStatus": "N",
    "Change": -300,
    "RatioChange": -2.31,
    "EstMatchedPrice": 0
  }
}
```
</details>
<br/>

### Foreign Room Data
``` javascript
// Channel: R:symbols 
// Example: R:SSI or R:SSI-VIC or R:ALL
const channel = 'R:SSI'
clientData.registerChannel(channel)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Rtype: Identify of type of data stream
   * TradingDate: Date & time of data record (DD/MM/YYYY)
   * Time: HH:MM:SSSS
   * ISIN: ISIN code
   * TotalRoom: Available no of shares for foreign trading
   * CurrentRoom: Total matched volumes which foreigner brought from market opening till the reporting time
   * FBuyVol: Total matched volumes which foreigner buy from market opening till the reporting time
   * FSellVol: Total matched volumes which foreigner sold from market opening till the reporting time
   * FBuyVal: Total matched buy value of foreign customers (BuyVal = BuyVol * LastPrice (giá khớp gần nhất))
   * FSellVal: Total matched sell value of foreign customers (SellVal = SellVol * LastPrice (giá khớp gần nhất))
   */
{
  datatype: 'R',
  content: {
    "RType": "R",
    "TradingDate": "04/05/2020",
    "Time": "15:02:45",
    "Isin": "YTC",
    "Symbol": "YTC",
    "TotalRoom": 0.0,
    "CurrentRoom": 1475400.0,
    "BuyVol": 0.0,
    "SellVol": 0.0,
    "BuyVal": 0.0,
    "SellVal": 0.0,
    "MarketId": "UPCOM",
    "Exchange": "UPCOM"
  }
}
```
</details>
<br/>

### Index Data
``` javascript
// Channel: MI:index
// Example: MI:VN30 or MI:VN30-HNXindex or MI:ALL
const channel = 'MI:VN30'
clientData.registerChannel(channel)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Rtype: Identify of type of data stream
   * IndexID: index ID
   * IndexValEst: value of the estimate index
   * IndexValue: value of the index
   * TradingDate: Date & time of data record (DD/MM/YYYY)
   * Time: HH:MM:SSSS
   * ISIN: ISIN code
   * Change: change
   * RatioChange: ratio change
   * TotalTrade: Tổng số lệnh khớp (cả thông thường và thỏa thuận)
   * TotalQtty: Tổng matched quantity of normal orders
   * TotalValue: Tổng matched value of normal orders
   * TypeIndex: index
          - Main: main index such as VN30
          - Industry: industrial related index
          - Other: non classified index
   * IndexName: name of index
   * Advances: total number of symbols having price increases
   * Nochanges: total number of symbols having price unchange
   * Declines: total number of symbols having price decrease
   * Ceiling: total number of symbols having last price = ceiling price
   * Floor: total number of symbols having last price = floor price
   * TotalQttyPT: total matched quantity of putthrough orders
   * TotalValuePT: total matched value of putthrough orders
   * TotalQttyOd
   * TotalValueOd
   * AllQty: total matched quantity of both normal and putthrough
   * AllValue: total matched value of both normal and putthrough
   * TradingSession: Session status of the market
            - ATO: Opening Call Auction
            - LO: Continuous Trading
            - ATC: Closing All Auction
            - PT: Putthrough
            - C: Market Close
            - BREAK: Lunch Break
            - HALT: Market Halt
   * Market: HOSE | HNX
   * Exchange: HOSE | HNX
   */
{
  'DataType': 'MI',
  'Content': {
    "IndexId": "VN30",
    “IndexValEst”: 1200.03,
    "IndexValue": 1238.76,
    "PriorIndexValue": 1226.16,
    "TradingDate": "02/04/2021",
    "Time": "11:28:13",
    "TotalTrade": 0.0,
    "TotalQtty": 191838100.0,
    "TotalValue": 7289093000000.0,
    "IndexName": "VN30",
    "Advances": 25,
    "NoChanges": 2,
    "Declines": 3,
    "Ceilings": 0,
    "Floors": 0,
    "Change": 12.6,
    "RatioChange": 1.03,
    "TotalQttyPt": 2064000.0,
    "TotalValuePt": 244251000000.0,
    "Exchange": "HOSE",
    "AllQty": 193902100.0,
    "AllValue": 7533344000000.0,
    "IndexType": "Main",
    "TradingSession": null,
    "MarketId": null,
    "RType": "MI",
    "TotalQttyOd": 0.0,
    "TotalValueOd": 0.0
  }
}
```
</details>
<br/>

### Realtime Bars
``` javascript
// Channel: B:index
// Example: B:SSI or B:SSI-VIC or B:ALL
const channel = 'B:SSI'
clientData.registerChannel(channel)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * Rtype: Identify of type of data stream
   * Time: HH:MM:SSSS
   * Symbol: symbol
   * Open: open price
   * High: high price
   * Low: low price
   * Close: close price
   * Volume: matched volume (KL khớp gần nhất)
   * Value: matched value (GT khớp gần nhất)
   */
{
  "Datatype": 'B',
  "Content": {
    "RType": "B",
    "Symbol": "SSI",
    "TradingTime": "14:28:33",
    "Open": 16000,
    "High": 16000,
    "Low": 16000,
    "Close": 16000,
    "Volume": 5000,
    "Value": 0
  }
}
```
</details>
<br/>

## Trading API
 - [Get order history](#Get-order-history)
 - [Get order book](#Get-order-book)
 - [Get audit order book](#Get-audit-order-book)
 - [Get position](#Get-position)
 - [Get derivatives position](#Get-derivatives-position)
 - [Get max buy quantity](#Get-max-buy-quantity)
 - [Get max sell quantity](#Get-max-sell-quantity)
 - [Get account balance](#Get-account-balance)
 - [Get derivative account balance](#Get-derivative-account-balance)
 - [Get purchasing power margin of account](#Get-purchasing-power-margin-of-account)
 - [Place new order](#Place-new-order)
 - [Place new derivative order](#Place-new-derivative-order)
 - [Modify order](#Modify-order)
 - [Modify derivative order](#Modify-derivative-order)
 - [Cancel order](#Cancel-order)
 - [Cancel derivative order](#Cancel-derivative-order)
 - [Stream trading](#Stream-trading)
<br/>
<br/>

### Get order history
``` javascript
 /** Request
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   * startDate: DD/MM/YYYY start date of search
   * endDate: DD/MM/YYYY end date of search
   */
 
await clientTrading.getOrderHistory(account, startDate, endDate)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * uniqueID: unique id of order
   * orderID: order id
   * buySell: order side (B: buy, S: sell)
   * price
   * quantity
   * filledQty: quantity filled
   * orderStatus: status of order
      - WA: waiting approval
      - RS: ready to send exchange
      - SD: send to exchange
      - QU: queue in exchange
      - FF: fully filled
      - PF: partially filled
      - FFPC: fully filled partially cancelled
      - WM: waiting modify
      - WC: waiting cancel
      - CL: cancelled
      - RJ: rejected
      - EX: expired
      - SOR: stop order ready
      - SOS: stop order sent
      - IAV: presession order
      - SOI: presession stop order
   * marketID: market ID (VN: stock, VNFE: derivatives)
   * inputTime: time place order
   * modifiedTime: time modify order
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * orderType: type of order
      - LO: limit order
      - ATO: at the opening
      - ATC: at the closing
      - MP: market order (HOSE)
      - MTL: market order
      - MOK: match or kill
      - MAK: match and kill
      - PLO: plo
      - GTD: good till date
   * cancelQty: quantity cancelled
   * avgPrice
   * isForcesell: F
   * isShortsell: F
   * rejectReason: reason reject order
   */
{
  "message": "Success",
  "status": 200,
  "data": {
    "orderHistories": [
      {
        "uniqueID": "560108",
        "orderID": "77564016",
        "buySell": "B",
        "price": 8900,
        "quantity": 100,
        "filledQty": 0,
        "orderStatus": "CL",
        "marketID": "VN",
        "inputTime": "1693969499000",
        "modifiedTime": "1693969929000",
        "instrumentID": "HAG",
        "orderType": "LO",
        "cancelQty": 100,
        "avgPrice": 0,
        "isForcesell": "F",
        "isShortsell": "F",
        "rejectReason": "0"
      }
    ],
    "account": "2645891"
  }
}
```
</details>
<br/>

### Get order book
``` javascript
 /** Request
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   */
 
await clientTrading.getOrderBook(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * uniqueID: unique id of order
   * orderID: order id
   * buySell: order side (B: buy, S: sell)
   * price
   * quantity
   * filledQty: quantity filled
   * orderStatus: status of order
      - WA: waiting approval
      - RS: ready to send exchange
      - SD: send to exchange
      - QU: queue in exchange
      - FF: fully filled
      - PF: partially filled
      - FFPC: fully filled partially cancelled
      - WM: waiting modify
      - WC: waiting cancel
      - CL: cancelled
      - RJ: rejected
      - EX: expired
      - SOR: stop order ready
      - SOS: stop order sent
      - IAV: presession order
      - SOI: presession stop order
   * marketID: market ID (VN: stock, VNFE: derivatives)
   * inputTime: time place order
   * modifiedTime: time modify order
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * orderType: type of order
      - LO: limit order
      - ATO: at the opening
      - ATC: at the closing
      - MP: market order (HOSE)
      - MTL: market order
      - MOK: match or kill
      - MAK: match and kill
      - PLO: plo
      - GTD: good till date
   * cancelQty: quantity cancelled
   * avgPrice
   * isForcesell: F
   * isShortsell: F
   * rejectReason: reason reject order
   */
{
  "message": "Success",
  "status": 200,
  "data": {
    "account": "2645891",
    "orders": [
      {
        "uniqueID": "560108",
        "orderID": "77564016",
        "buySell": "B",
        "price": 8900,
        "quantity": 100,
        "filledQty": 0,
        "orderStatus": "CL",
        "marketID": "VN",
        "inputTime": "1693969499000",
        "modifiedTime": "1693969929000",
        "instrumentID": "HAG",
        "orderType": "LO",
        "cancelQty": 100,
        "avgPrice": 0,
        "isForcesell": "F",
        "isShortsell": "F",
        "rejectReason": "0"
      }
    ]
  }
}
```
</details>
<br/>

### Get audit order book
``` javascript
 /** Request
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   */
 
await clientTrading.getAuditOrderBook(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * uniqueID: unique id of order
   * orderID: order id
   * buySell: order side (B: buy, S: sell)
   * price
   * quantity
   * filledQty: quantity filled
   * orderStatus: status of order
      - WA: waiting approval
      - RS: ready to send exchange
      - SD: send to exchange
      - QU: queue in exchange
      - FF: fully filled
      - PF: partially filled
      - FFPC: fully filled partially cancelled
      - WM: waiting modify
      - WC: waiting cancel
      - CL: cancelled
      - RJ: rejected
      - EX: expired
      - SOR: stop order ready
      - SOS: stop order sent
      - IAV: presession order
      - SOI: presession stop order
   * marketID: market ID (VN: stock, VNFE: derivatives)
   * inputTime: time place order
   * modifiedTime: time modify order
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * orderType: type of order
      - LO: limit order
      - ATO: at the opening
      - ATC: at the closing
      - MP: market order (HOSE)
      - MTL: market order
      - MOK: match or kill
      - MAK: match and kill
      - PLO: plo
      - GTD: good till date
   * cancelQty: quantity cancelled
   * avgPrice
   * isForcesell: F
   * isShortsell: F
   * rejectReason: reason reject order
   */
{
  "message": "Success",
  "status": 200,
  "data": {
    "account": "2645891",
    "orders": [
      {
        "uniqueID": "560108",
        "orderID": "77564016",
        "buySell": "B",
        "price": 8900,
        "quantity": 100,
        "filledQty": 0,
        "orderStatus": "CL",
        "marketID": "VN",
        "inputTime": "1693969499000",
        "modifiedTime": "1693969929000",
        "instrumentID": "HAG",
        "orderType": "LO",
        "cancelQty": 100,
        "avgPrice": 0,
        "isForcesell": "F",
        "isShortsell": "F",
        "rejectReason": "0",
        "lastErrorEvent": null
      },
      {
        "uniqueID": "83117",
        "orderID": "T20230906yMU00083117",
        "buySell": "B",
        "price": 6000,
        "quantity": 100,
        "filledQty": 0,
        "orderStatus": "RJ",
        "marketID": "VN",
        "inputTime": "1693969146232",
        "modifiedTime": "1693969146232",
        "instrumentID": "HAG",
        "orderType": "LO",
        "cancelQty": 0,
        "avgPrice": 0,
        "isForcesell": null,
        "isShortsell": "F",
        "rejectReason": "Order price lower limit can not exceed spread limit",
        "lastErrorEvent": null
      }
    ]
  }
}
```
</details>
<br/>

### Get position
``` javascript
 /** Request
   * account: AccountNo stock market
   */
 
await clientTrading.getPosition(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * totalMarketValue: = sum (marketprice * onhand) of all instrumentid
   * stockPositions: portfolio of account
   * marketID: market ID (VN: stock, VNFE: derivatives)
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * onHand: Total quantity of securities
   * block: Quantity of blockaded securities
   * bonus
   * buyT0: Intraday bought
   * buyT1: Quantity securities bought matched of day T-1
   * buyT2: Quantity securities bought matched of day T-2
   * sellT0: Intraday sold
   * sellT1: Quantity securities sold matched of day T-1
   * sellT2: Quantity securities sold matched of day T-2
   * avgPrice: Average matched price
   * mortgage: Quantity of mortgage securities
   * holdForTrade: Securities awaiting fo trade
   * marketPrice: Market price of securities
   */
{
  message: "Success",
  status: 200,
  data: {
    account": "0901351,
    totalMarketValue: 0,
    stockPositions: [
      {
        marketID: "VN",
        instrumentID: "SSI",
        onHand: 50300,
        block: 0,
        bonus: 7425,
        buyT0: 0,
        buyT1: 0,
        buyT2: 0,
        sellT0: 0,
        sellT1: 0,
        sellT2: 0,
        avgPrice: 18505,
        mortgage: 0,
        sellableQty: 50300,
        holdForTrade: 0,
        marketPrice: 0
      }
    ]
  }
}
```
</details>
<br/>

### Get derivatives position
``` javascript
 /** Request
   * account: AccountNo Derivatives market
   */
 
await clientTrading.getDerPosition(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * marketID: market ID (VN: stock, VNFE: derivatives)
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * longQty: Long position
   * shortQty: Short position
   * net: Net position
   * bidAvgPrice: Average bid price
   * askAvgPrice: Average ask price
   * tradePrice: Trade price
   * marketPrice: Maket price
   * floatingPL: Temporarily calculated profit and loss
   * tradingPL: Calculated profit and loss
   */
{
  message: "Success",
  status: 200,
  data: {
    account: "0901358",
    openPosition: [
      {
        marketID: "VNFE",
        instrumentID: "VN30F2106",
        longQty: 8,
        shortQty: 0,
        net: 8,
        bidAvgPrice: 0,
        askAvgPrice: 0,
        tradePrice: 1452.7,
        marketPrice: 1452.7,
        floatingPL: 0,
        tradingPL: 0
      }
    ],
    closePosition: [
      
    ]
  }
}
```
</details>
<br/>

### Get max buy quantity
``` javascript
 /** Request
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * price
   */
 
await clientTrading.getMaxBuyQty(account, instrumentID, price)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   * maxBuyQty: max buy quantity
   * marginRatio: margin ratio
   * purchasingPower: Purchasing power
   */
{
  message: "Success",
  status: 200,
  data: {
    account: "0041691",
    maxBuyQty: 8241440,
    marginRatio: "50%",
    purchasingPower: 99292902171
  }
}
```
</details>
<br/>

### Get max sell quantity
``` javascript
 /** Request
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   */
 
await clientTrading.getMaxSellQty(account, instrumentID)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * account: AccountNo stock market or derivatives market, example: 2645891(stock), 2645898(derivative)
   * maxSellQty: max sell quantity
   */
{
  message: "Success",
  status: 200,
  data: {
    account: "0041691",
    maxSellQty: 2000
  }
}
```
</details>
<br/>

### Get account balance
``` javascript
 /** Request
   * account: AccountNo stock market
   */
 
await clientTrading.getAccountBalance(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * account: AccountNo stock market
   * cashBal: Total cash balance
   * cashOnHold: Total cash on hold
   * secureAmount: Secure amount intraday
   * withdrawable: Withdrawable money
   * receivingCashT1: Receiving amount T+1
   * receivingCashT2: Receiving amount T+2
   * matchedBuyVolume: Matched buy volume
   * matchedSellVolume: Matched sell volume
   * unMatchedBuyVolume: Unmatched buy volume
   * unMatchedSellVolume: Unmatched sell volume
   * paidCashT1: Paid cash T+1
   * paidCashT2: Paid cash T+2
   * cia: cash in advance
   * purchasingPower: Purchasing power
   * debt: Total debt
   * totalAssets: Total asset (not debt reduction)
   */
{
  "message": "Success",
  "status": 200,
  "data": {
    "account": "2645891",
    "cashBal": 1100000,
    "cashOnHold": 0,
    "secureAmount": 0,
    "withdrawable": 1100000,
    "receivingCashT1": 0,
    "receivingCashT2": 0,
    "matchedBuyVolume": 0,
    "matchedSellVolume": 0,
    "debt": 0,
    "unMatchedBuyVolume": 0,
    "unMatchedSellVolume": 0,
    "paidCashT1": 0,
    "paidCashT2": 0,
    "cia": 0,
    "purchasingPower": 1100000,
    "totalAssets": 1100000
  }
}
```
</details>
<br/>

### Get derivative account balance
``` javascript
 /** Request
   * account: AccountNo derivative market
   */
 
await clientTrading.getDerAccountBalance(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * account: AccountNo derivative market
   * accountBalance: Total cash balance
   * fee
   * commission
   * interest
   * loan
   * deliveryAmount: Delivery amount
   * floatingPL: Temporarily calculated profit and loss
   * totalpl: Total profit and loss
   * marginable: Money can deposit in SSI
   * depositable: Money can deposit in VND
   * rccall
   * withdrawable: Withdrawable amount
   * nonCashDrawableRCCall: Stock value can be withdrawn
   */
{
  "message": "Success",
  "status": 200,
  "data": {
    "account": "2645898",
    "accountBalance": 100000,
    "fee": 0,
    "commission": 0,
    "interest": 0,
    "loan": 0,
    "deliveryAmount": 0,
    "floatingPL": 0,
    "totalPL": 0,
    "marginable": 0,
    "depositable": 0,
    "rcCall": 0,
    "withdrawable": 100000,
    "nonCashDrawableRCCall": 0,
    "internalAssets": {
      "cash": 100000,
      "validNonCash": 0,
      "totalValue": 100000,
      "maxValidNonCash": 0,
      "cashWithdrawable": 100000,
      "ee": 75000
    },
    "exchangeAssets": {
      "cash": 0,
      "validNonCash": 0,
      "totalValue": 0,
      "maxValidNonCash": 0,
      "cashWithdrawable": 0,
      "ee": 0
    },
    "internalMargin": {
      "initialMargin": 0,
      "deliveryMargin": 0,
      "marginReq": 0,
      "accountRatio": 0,
      "usedLimitWarningLevel1": 75,
      "usedLimitWarningLevel2": 85,
      "usedLimitWarningLevel3": 90,
      "marginCall": 0
    },
    "exchangeMargin": {
      "marginReq": 0,
      "accountRatio": 0,
      "usedLimitWarningLevel1": 75,
      "usedLimitWarningLevel2": 85,
      "usedLimitWarningLevel3": 90,
      "marginCall": 0
    }
  }
}
```
</details>
<br/>

### Get purchasing power margin of account (only stock account)
``` javascript
 /** Request
   * account: AccountNo stock market
   */
 
await clientTrading.getPpmmrAccount(account)
```
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * collateralAsset: Total collateral Asset
   * callLMW: Maintenance margin ratio
   * liability: Total debt
   * eeOrigin
   * forceLMV
   * equity: Net LMV
   * ee
   * callMargin: Call Margin
   * cashBalance: Cash Balance
   * purchasingPower: Purchasing Power
   * callForcesell: Call Forcesell
   * lmv: Stock Market Value (margin)
   * marginCall: Call Amount
   * withdrawal: Withdrawal
   * collateralA
   * action: Action call margin
   * marginRatio: Margin Ratio
   * debt: Call Forcesell
   * accruedInterest: Accrued Interest
   * holdRight: Right subcription
   * preLoan: Pre Debt
   * fees
   * buyUnmatch: Unmatched buy volume
   * ap: Matched buy volume
   * apT1: Receiving amount T+1
   * sellUnmatch: Unmatched sell volume
   * ar: Matched sell volume
   * arT1: Paid cash T+1
   * cia: cash in advance
   * ppCredit
   * creditLimit
   * totalAssets
   * marginCallLMVSold: Call LMV Sold
   * lmvNonMarginable: Stock Market Value
   */
{
  "message": "Success",
  "status": 200,
  "data": {
    "collateralAsset": 1100000,
    "callLMW": 0,
    "liability": 0,
    "eeOrigin": 1100000,
    "forceLMV": 0,
    "equity": 1100000,
    "ee": 1100000,
    "callMargin": 0,
    "cashBalance": 1100000,
    "purchasingPower": 1100000,
    "callForcesell": 0,
    "lmv": 0,
    "marginCall": 0,
    "withdrawal": 1100000,
    "collateralA": 0,
    "action": "",
    "marginRatio": 1,
    "debt": 0,
    "accruedInterest": 0,
    "holdRight": 0,
    "preLoan": 0,
    "fees": 0,
    "buyUnmatch": 0,
    "ap": 0,
    "apT1": 0,
    "sellUnmatch": 0,
    "cia": 0,
    "ar": 0,
    "arT1": 0,
    "ppCredit": 1100000,
    "creditLimit": 0,
    "totalAssets": 1100000,
    "marginCallLMVSold": 0,
    "lmvNonMarginable": 0,
    "eeCredit": 1100000,
    "totalEquity": 1100000,
    "eE90": 1222222,
    "eE80": 1375000,
    "eE70": 1571429,
    "eE60": 1833333,
    "eE50": 2200000
  }
}
```
</details>
<br/>

### Place new order
``` javascript
 /** Request
   * account: AccountNo stock market
   * buySell: order side (B: buy, S: sell)
   * market: market ID (VN: stock, VNFE: derivatives)
   * instrumentID: symbol, ex: SSI, VIC, VN30F2309,...
   * price: If ordertype is LO, price must be > 0. If ordertype <> LO, price = 0
   * quantity
   * orderType: type of order
      - LO: limit order
      - ATO: at the opening
      - ATC: at the closing
      - MP: market order (HOSE)
      - MTL: market order
      - MOK: match or kill
      - MAK: match and kill
      - PLO: plo
      - GTD: good till date
   * channelID
      - WT: web trading
      - MA: Mobile
      - BR: Broker
      - IW: iBoard web
      - IM: iBoard mobile
      - ..: Trade API
      - VT: Pro Trading
   * stopOrder: true(for conditional order), false(for normal order)
   * stopPrice: default = 0, If stoporder = True, stopprice > 0
   * stopType: If stoporder = True, stopType in value list
      - D: down
      - U: up
      - V: trailing up
      - E: trailing down
      - O: OCO
      - B: bull bear
   * stopStep: default = 0, If stoporder = True, stopStep > 0
   * lossStep: default = 0, If stoporder = True and stopstyle = B, lossstep > 0
   * profitStep: default = 0, If stoporder = True and stopstyle = B, profitstep > 0
   */

const order = {account, buySell, market, orderType, price, quantity, instrumentID, channelID, stopOrder, stopPrice, stopType, stopStep, lossStep, profitStep} 
await clientTrading.newOrder(order)
```
<details>
 <summary>View Response</summary>
 
```js
{
  message: "Success",
  status: 200,
  data: {
    requestID: "1678195",
    requestData: {
      instrumentID: "SSI",
      market: "VN",
      buySell: "B",
      orderType: "LO",
      channelID: "IW",
      price: 21000,
      quantity: 300,
      account: "0901351",
      stopOrder: false,
      stopPrice: 0,
      stopType: "string",
      stopStep: 0,
      lossStep: 0,
      profitStep: 0
    }
  }
}
```
</details>
<br/>

### Place new derivative order
``` javascript
 /** Request
   The same new order
   */

const order = {account, buySell, market, orderType, price, quantity, instrumentID, channelID, stopOrder, stopPrice, stopType, stopStep, lossStep, profitStep} 
await clientTrading.newDerOrder(order)
```
<details>
 <summary>View Response</summary>
 
```js
{
  message: "Success",
  status: 200,
  data: {
    requestID: "1678195",
    requestData: {
      "instrumentID": "VN30F2306",
      "market": "VNFE",
      "buySell": "B",
      "orderType": "LO",
      "channelID": "TA",
      "price": 1200,
      "quantity": 100,
      "account": "1184418",
      "stopOrder": false,
      "stopPrice": 0,
      "stopType": "",
      "stopStep": 0,
      "lossStep": 0,
      "profitStep": 0
    }
  }
}
```
</details>
<br/>

### Modify order
``` javascript
 /** Request
   * orderID: ID of the order to modify
   * price: New price if the price is changed. Otherwise, price of original order
   * quantity: New quantity if the quantity is changed. Otherwise, quantity of original order
   * account: Account of the original order
   * instrumentID: Symbol of the original order
   * marketID: MarketID of the original order
   * buySel: Side of the original order
   * orderType: Order Type of the original order
   */

const order = {orderID, price, quantity, account, instrumentID, marketID, buySell, orderType } 
await clientTrading.modifyOrder(order)
```
<details>
 <summary>View Response</summary>
 
```js
{
  message: "Success",
  status: 200,
  data: {
    requestID: "93235974",
    requestData: {
      orderID: "12658867",
      price: 1410,
      quantity: 2,
      account: "0901358",
      instrumentID: "VN30F2106",
      marketID: "VNFE",
      buySell: "B",
      orderType: "LO"
    }
  }
}
```
</details>
<br/>

### Modify derivative order
``` javascript
 /** Request
   The same modify order
   */

const order = {orderID, price, quantity, account, instrumentID, marketID, buySell, orderType } 
await clientTrading.modifyDerOrder(order)
```
<details>
 <summary>View Response</summary>
 
```js
{
  message: "Success",
  status: 200,
  data: {
    requestID: "93235974",
    requestData: {
      orderID: "12658867",
      price: 1410,
      quantity: 2,
      account: "0901358",
      instrumentID: "VN30F2106",
      marketID: "VNFE",
      buySell: "B",
      orderType: "LO"
    }
  }
}
```
</details>
<br/>

### Cancle order
``` javascript
 /** Request
   * orderID: ID of the order to modify
   * account: Account of the original order
   * instrumentID: Symbol of the original order
   * marketID: MarketID of the original order
   * buySel: Side of the original order
   */

const order = {orderID,  account, instrumentID, marketID, buySell} 
await clientTrading.cancleOrder(order)
```
<details>
 <summary>View Response</summary>
 
```js
{
  message: "Success",
  status: 200,
  data: {
    requestID: "52513603",
    requestData: {
      orderID: "12658867",
      account: "0901358",
      marketID: "VNFE",
      instrumentID: "VN30F2106",
      buySell: "B",
      requestID: "52513603"
    }
  }
}
```
</details>
<br/>

### Cancel derivative order
``` javascript
 /** Request
   The same cancel order
   */

const order = {orderID,  account, instrumentID, marketID, buySell} 
await clientTrading.cancleDerOrder(order)
```
<details>
 <summary>View Response</summary>
 
```js
{
  message: "Success",
  status: 200,
  data: {
    requestID: "52513603",
    requestData: {
      orderID: "12658867",
      account: "0901358",
      marketID: "VNFE",
      instrumentID: "VN30F2106",
      buySell: "B",
      requestID: "52513603"
    }
  }
}
```
</details>
<br/>

# Stream trading
``` javascript
// Init stream data (only one)
clientTrading.initStream()
```
 - [Order Event Response](#Order-Event-Response)
 - [Order Error](#Order-Error)
 - [Order Match Event](#Order-Match-Event)
 - [Porfolio Streaming](#Porfolio-Streaming)

### Order Event Response
<details>
 <summary>View Response</summary>
 
```js
 /** Response
   * type: Type of event
   * uniqueID
   * prefix
   * ipAddress: To detect the request from client to TAPI
   * notifyID: The serial number of msg
   * orderID
   * instrumentID: Stock symbol 
   * buySell
   * orderType
   * price
   * quantity
   * marketID
   * origRequestID
   * account
   * cancelQty: Total quantity was cancelled
   * osqty: Total quantity was not matched
   * filledQty: Total quantity was matched
   * avgPrice
   * channel
   * inputTime: unixtime
   * modifiedTime: unixtime
   * isForceSell
   * isShortSell
   * orderStatus
   * origOrderID: The order id of the parent conditional order
   * rejectReason
   * stopOrder: Defined order type is Stop order
   * stopType: If stopOrder = True, stopType in value list
   * stopStep
   * stopPrice
   * profitPrice
   */

// new order
{
  "type": "orderEvent",
  "data": {
    "orderID": "12663204",
    "notifyID": 10,
    “instrumentID":"VN30F2106", 
    "uniqueID":"30304045", 
    "buySell":"B", 
    “orderType": "LO",
    "ipAddress": "192.168.202.36",
    "price": 1410,
    "prefix": "2mw",
    "quantity": 10,
    "marketID": "VNFE",
    "origOrderId": "",
    "account": "0901358",
    "cancelQty": 0,
    "osQty": 10,
    "filledQty": 0,
    "avgPrice": 0,
    "channel": "TA",
    "inputTime": "1606277281849",
    "modifiedTime": "1606277281850",
    "isForceSell": "F",
    "isShortSell": "F",
    "orderStatus": "RS",
    "rejectReason": "",
    "origRequestID": "30304045",
    "stopOrder": false,
    "stopPrice": 0,
    "stopType": "",
    "stopStep": 0,
    "profitPrice": 0
  }
}

// modify order
{
  "type": "orderEvent",
  "data": {
    "orderID": "12663204",
    "notifyID": 11,
    "instrumentID": "VN30F2106",
    "uniqueID": "31618366",
    "buySell": "B",
    "orderType": "LO",
    "ipAddress": "192.168.202.36",
    "price": 1410,
    "prefix": "2mw",
    "quantity": 2,
    "marketID": "VNFE",
    "origOrderId": "",
    "account": "0901358",
    "cancelQty": 0,
    "osQty": 2,
    "filledQty": 0,
    "avgPrice": 0,
    "channel": "TA",
    "inputTime": "1606277281849",
    "modifiedTime": "1606277330852",
    "isForceSell": "F",
    "isShortSell": "F",
    "orderStatus": "RS",
    "rejectReason": "",
    "origRequestID": "30304045",
    "stopOrder": false,
    "stopPrice": 0,
    "stopType": "",
    "stopStep": 0,
    "profitPrice": 0
  }
}

// cancel order
{
  "type": "orderEvent",
  "data": {
    "orderID": "12663204",
    "notifyID": 12,
    "instrumentID": "VN30F2106",
    "uniqueID": "59028516",
    "buySell": "B",
    "orderType": "LO",
    "ipAddress": "192.168.202.36",
    "price": 1410,
    "prefix": "2mw",
    "quantity": 2,
    "marketID": "VNFE",
    "origOrderId": "",
    "account": "0901358",
    "cancelQty": 2,
    "osQty": 0,
    "filledQty": 0,
    "avgPrice": 0,
    "channel": "TA",
    "inputTime": "1606277281849",
    "modifiedTime": "1606277330861",
    "isForceSell": "F",
    "isShortSell": "F",
    "orderStatus": "CL",
    "rejectReason": "",
    "origRequestID": "30304045",
    "stopOrder": false,
    "stopPrice": 0,
    "stopType": "",
    "stopStep": 0,
    "profitPrice": 0
  }
}
```
</details>
<br/>

### Order Error
<details>
 <summary>View Response</summary>
 
```js
{
  "type": "orderError",
  "data": {
    "message": "This channel has been block; disallow to place order ",
    "notifyID": 0,
    "errorCode": "ORD015",
    "uniqueID": "6163422",
    "orderID": "T20230504w3806163422",
    "instrumentID": "SSI",
    "ipAddress": "10.255.241.47",
    "buySell": "B",
    "prefix": "w38",
    "orderType": "LO",
    "price": 19600,
    "quantity": 200,
    "marketID": "VN",
    "origOrderId": "T20230504w3806163422",
    "account": "0322206",
    "channel": "TA",
    "inputTime": "1683165600160",
    "modifiedTime": "1683165600161",
    "isForceSell": "F",
    "isShortSell": "F",
    "origRequestID": "6163422",
    "stopOrder": false,
    "stopPrice": 0,
    "stopType": "",
    "stopStep": 0,
    "profitPrice": 0,
    "modifiable": false,
    "note": ""
  }
}
```
</details>
<br/>

### Order Match Event
<details>
 <summary>View Response</summary>
 
```js
{
  "type": "orderMatchEvent",
  "data": {
    "orderID": "16201867",
    "notifyID": 101180,
    "instrumentID": "BVS",
    "uniqueID": "24194396",
    "buySell": "B",
    "matchPrice": 1000,
    "ipAddress": "10.48.41.16",
    "matchQty": 100,
    "prefix": "t4c",
    "account": "1184411",
    "matchTime": "1656665019000"
  }
}
```
</details>
<br/>

### Porfolio Streaming
<details>
 <summary>View Response</summary>
 
```js
{
  "type": "clientPortfolioEvent",
  "data": {
    "account": "0901358",
    "notifyID": 27,
    "data": null,
    "clientPortfoliosOpen": [
      {
        "martketID": "VNFE",
        "instrumentID": "VN30F2106",
        "longQty": 9,
        "shortQty": 0,
        "net": 9,
        "bidAvgPrice": 1402.4000244140625,
        "askAvgPrice": 0,
        "tradePrice": 0,
        "marketPrice": 873,
        "floatingPL": -476460000,
        "tradingPL": 0
      },
      {
        "martketID": "VNFE",
        "instrumentID": "VN30F2107",
        "longQty": 2,
        "shortQty": 0,
        "net": 2,
        "bidAvgPrice": 830,
        "askAvgPrice": 0,
        "tradePrice": 0,
        "marketPrice": 830,
        "floatingPL": 0,
        "tradingPL": 0
      }
    ],
    "unique ID": null,
    "clientPortfoliosClose": null,
    "connectionID": "",
    "ipAddress": null,
    "prefix": null
  }
}
```
</details>
<br/>
