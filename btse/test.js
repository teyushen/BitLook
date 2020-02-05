const btse = require('./btseV2');
const btseWebsocket = require('./btseWebsocket');
const opts = {
    logDirectory:'log', // NOTE: folder must exist and be writable...
    fileNamePattern:'btse-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};
const manager = require('simple-node-logger').createLogManager(opts);
manager.createConsoleAppender(opts);
const log = manager.createLogger(opts);

let orderIds = {};
btseWebsocket.init();

run();
async function run() {
    log.info('begin test');
    for (let i = 0; i < 10; i++) {
        await sleep(400);

        // if(i%10 === 0) {
            log.info('orderIds: ', JSON.stringify(orderIds), ', btseWebsocket.delObj: ', Object.keys(btseWebsocket.delObj));
        // }
        placeOrder();
        removeCancelOrder(btseWebsocket.delObj);
    }
    await sleep(3 * 1000);
    removeCancelOrder(btseWebsocket.delObj);
    log.info('end test remain orderIds: ', JSON.stringify(orderIds), ', btseWebsocket.delObj: ', Object.keys(btseWebsocket.delObj));
    await sleep(1000);
    process.exit(1);
}

// setInterval(function () {
//     let arr = Object.keys(orderIds);
//     for(let i = 0 ; i < arr.length; i ++) {
//         if(!orderIds[arr[i]]) {
//             log.info('cancel again orderId', arr[i]);
//             btse.cancelOrder({symbol: 'BTCPFC', orderID: arr[i]}).catch(e => {
//                 log.error('cancel fail ', e);
//             });
//         }
//     }
// }, 2 * 1000);

function removeCancelOrder(delObj) {
    let arr = Object.keys(delObj);
    for(let i = 0 ; i < arr.length; i ++) {
        delete orderIds[arr[i]];
        delete delObj[arr[i]];
    }
}

function placeOrder() {
    btse.createOrder({
        "size": 1,
        "price": 6000,
        "side": "BUY",
        "time_in_force": "GTC",
        "type": "LIMIT",
        "symbol": "BTCPFC",
        "txType": "STOP",
        "postOnly": false,
        "reduceOnly": false,
        "triggerPrice": 10000,
        "stopPrice": 10000,
        "trailValue": 0
    }).then(resp => {
        // console.log('orderID: ', resp.orderID);
        // console.log(orderIds);
        // orderIds.push(resp.orderID);
        orderIds[resp.orderID] = true;
        log.debug('make an order id: ', resp.orderID);
        btse.cancelOrder({symbol: 'BTCPFC', orderID: resp.orderID}).catch(e => {
            orderIds[resp.orderID] = false;
            log.error('cancel fail ', e);
        });
    }).catch(e => log.error('place order fail ', e));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
