const bitMex = require('./bitMEX/bitMex');


bitMex.getOrderBook({symbol: 'XBTUSD', depth: 1}).then(resp => console.log(resp));
// bitMex.createOrder({symbol: 'XBTUSD', orderQty: 20}).then(resp => console.log(resp));
// bitMex.getOrder({symbol: 'XBTUSD'}).then(resp => console.log(resp));