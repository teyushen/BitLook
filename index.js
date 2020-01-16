const bitMex = require('./bitMEX/bitMex');
const btse = require('./btse/btseV2');


// bitMex.getOrderBook({symbol: 'XBTUSD', depth: 1}).then(resp => console.log(resp));
// bitMex.createOrder({symbol: 'XBTUSD', orderQty: 20}).then(resp => console.log(resp));
// bitMex.getOrder({symbol: 'XBTUSD'}).then(resp => console.log(resp));


// setInterval(function () {
//     btse.getWallet({wallet: 'CROSS@'}).then(resp => console.log(resp));
//     btse.getOpenOrder({symbol: 'BTCPFC'}).then(resp => console.log(resp));
//     btse.getPosition({symbol: 'BTCPFC'}).then(resp => console.log(resp));
// }, 100);

btse.createOrder({
    "size": 1,
    "price": 6000,
    "side": "BUY",
    "time_in_force": "GTC",
    "type": "OCO",
    "symbol": "BTCPFC",
    "txType": "STOP",
    "postOnly": false,
    "reduceOnly": false,
    "triggerPrice": 10000,
    "stopPrice": 10000,
    "trailValue": 0
}).then(resp => console.log(resp)).catch(e => e);