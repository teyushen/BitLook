const bitMex = require('./bitMEX/bitMex');
const btse = require('./btse/btseV2');

/**
 * BitMEX
 */
// bitMex.getOrderBook({symbol: 'XBTUSD', depth: 1}).then(resp => console.log(resp));
// bitMex.createOrder({symbol: 'XBTUSD', orderQty: 20}).then(resp => console.log(resp));
// bitMex.getOrder({symbol: 'XBTUSD', filter: JSON.stringify({open: true})}).then(resp => console.log(resp));
// bitMex.getPosition({symbol: 'XBTUSD'}).then(resp => console.log(resp));
// bitMex.closePosition({symbol: 'XBTUSD'}).then(resp => console.log(resp));

// btse.getOrderBook({symbol: 'BTCPFC', depth: 1}).then(resp => console.log(resp));
// btse.getWallet({wallet: 'CROSS@'}).then(resp => console.log(resp));
// btse.getOpenOrder({symbol: 'BTCPFC'}).then(resp => console.log(resp)).catch(e => e);
// btse.getPosition({symbol: 'BTCPFC'}).then(resp => console.log(resp));
btse.closePosition({symbol: "BTCPFC", type: 'MARKET'}).then(resp => console.log(resp));

// btse.createOrder({
//     "size": 1,
//     "price": 8000,
//     "side": "BUY",
//     "symbol": "BTCPFC",
//     "type": "LIMIT"
// }).then(resp => console.log(resp)).catch(e => e);