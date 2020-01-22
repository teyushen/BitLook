const WebSocketClient = require('websocket').client;
const HmacSHA384 = require("crypto-js/hmac-sha384");
const settings = require('../settings');
const opts = {
    logDirectory:'log', // NOTE: folder must exist and be writable...
    fileNamePattern:'btse-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};
const manager = require('simple-node-logger').createLogManager(opts);
manager.createConsoleAppender(opts);
const log = manager.createLogger(opts);


let delObj = {};

function processMsg(connection, str) {
    if (str === 'dennisshen is authenticated successfully') {
        log.info(str);
        connection.sendUTF(JSON.stringify({"op": "subscribe", "args": ["notificationApi"]}));
    } else if (str === 'peter0105 is authenticated successfully') {
        log.info(str);
        connection.sendUTF(JSON.stringify({"op": "subscribe", "args": ["notificationApi"]}));
    } else if (str === 'UNLOGIN_USER connect success') {
        log.info(str);
    } else if (isJson(str)) {
        let resp = JSON.parse(str);
        if (resp['topic'] === 'notificationApi') {
            let notification = resp.data;
            if (notification.status === 'ORDER_CANCELLED') {
                delObj[notification.orderID] = true;
                log.info('cancel order id: ', notification.orderID);
            }
        }
    }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


module.exports = {
    init: function () {
        let client = new WebSocketClient();

        let secretKey = settings.BTSE.btseSecret;
        let btsenonce = new Date().getTime() + "";
        let topicPath = "/futures/api/topic" + btsenonce + "";
// if(document.getElementById("url").value.includes("spotWS")) {
//     myString = "/spotWS" + btsenonce + "";
// }

        let signature = HmacSHA384(topicPath, secretKey);
        let msg = {
            "op": "authKeyExpires",
            "args": [settings.BTSE.btseApi, btsenonce, signature + ""]
        };
        // console.log(msg);

        client.on('connectFailed', function (error) {
            log.error('Connect Error: ' + error.toString());
        });

        client.on('connect', function (connection) {
            log.info('WebSocket Client Connected');
            connection.sendUTF(JSON.stringify(msg));

            connection.on('error', function (error) {
                log.error("Connection Error: " + error.toString());
            });
            connection.on('close', function () {
                log.info('echo-protocol Connection Closed');
            });
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    // console.log("Received: '" + message.utf8Data + "'");
                    processMsg(connection, message.utf8Data);
                }
                // connection.sendUTF(JSON.stringify({"op":"subscribe","args":["notification"]}));
            });

        });

        client.connect(settings.BTSE.websocket);
    },

    delObj: delObj,

}