const CryptoJS = require('crypto-js');
const request = require('request');
const queryString = require('query-string');
const settings = require('../settings');

let btseUrl = settings.BTSE.btseUrl;
let btseApi = settings.BTSE.btseApi;
let btseSecret = settings.BTSE.btseSecret;

module.exports = {

    getOrderBook: function (symbol) {
        let subPath = '/futures/api/v1/orderbook/' + symbol;
        let options = prepareOptions('GET', subPath, null);

        return respPromise(options);
    },

    getAllWallet: function () {
        let subPath = '/futures/api/v1/all_wallet';
        let options = prepareOptions('GET', subPath, null);

        return respPromise(options);

    },

    getWallet: function (params) {
        let subPath = '/futures/api/v1/wallet';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    getOpenOrder: function (params) {
        let subPath = '/futures/api/v1/all_open_orders';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    getPosition: function (params) {
        let subPath = '/futures/api/v1/all_positions';
        let options = prepareOptions('GET', subPath, params);
        // options.timeout = 10;

        return respPromise(options);

    },

    createOrder: function (body) {
        let subPath = '/futures/api/v1/order/market';
        let options = prepareOptions('POST', subPath, null, body);

        return respPromise(options);
    },

    /**
     *
     * @param params  {symbol: 'BTCPFC'}
     * @returns {Promise<boolean>}
     */
    closePosition: async function (params) {
        let success = false;
        await this.getPosition(params).then(async positions => {
            if(positions && positions.length === 1) {
                let side = positions[0].side === 'BUY' ? 'SELL' : 'BUY';
                let size = positions[0].totalContracts;
                await this.createOrder({
                    size: size,
                    side: side,
                    symbol: params.symbol
                }).then(resp => {
                    if(resp) {
                        success = true;
                    }
                }).catch(error => console.error(error));
            } else if(positions && positions.length === 0) {
                success = true;
            }
        }).catch(error => console.error(error));
        return success;
    },
}

function respPromise(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (response && response.statusCode == 200) {
                // console.log(JSON.parse(body));
                // console.log(response.statusCode);
                resolve(JSON.parse(body));
            } else if (response) {
                // console.log(body);
                reject(body);
            } else {
                // console.log(error);
                reject(error);
            }
        });
    })
}


function prepareOptions(verb, subPath, params, body) {
    let btseNounce = new Date().getTime();
    body = body ? JSON.stringify(body) : '';
    let path = subPath + btseNounce + body;
    let btseSign = CryptoJS.HmacSHA384(path, btseSecret).toString();
    let url = btseUrl + subPath + (params ? "?" + queryString.stringify(params) : '');

    let options = {
        method: verb,
        url: url,
        headers: {
            'Accept': 'application/json',
            'btse-nonce': btseNounce,
            'btse-api': btseApi,
            'btse-sign': btseSign
        },
        body: body,
    };

    return options;
}
