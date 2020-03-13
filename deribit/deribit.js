const CryptoJS = require('crypto-js');
const Base64 = require('js-base64').Base64;
const request = require('request');
const queryString = require('query-string');
const settings = require('../settings');

let deribitUrl = settings.DERIBIT.deribitUrl;
let clientId = settings.DERIBIT.deribitId;
let clientSecret = settings.DERIBIT.deribitSecret;

module.exports = {

    /**
     *
     * @param params eg: {symbol: 'BTCPFC', depth: 1}
     * @returns {Promise<any>}
     */
    getOrderBook: function (params) {
        let subPath = '/api/v2/orderbook/L2';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);
    },

    /**
     * wallet: CROSS@, ISOLATED@BTCPFC-USD
     *
     * @param params eg: {wallet: 'CROSS@'}
     * @returns {Promise<unknown>}
     */
    getWallet: function (params) {
        let subPath = '/api/v2/user/wallet';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    /**
     * symbol: BTCPFC
     *
     * @param params eg: {symbol: 'BTCPFC'}
     * @returns {Promise<unknown>}
     */
    getMargin: function (params) {
        let subPath = '/private/get_margins';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    /**
     * currency: BTC, ETH
     * @param params eg: {currency: 'BTC', kind: 'future', type: 'all'}
     * @returns {Promise<unknown>}
     */
    getOpenOrder: function (params) {
        let subPath = '/api/v2/private/get_open_orders_by_currency' + (params ? "?" + queryString.stringify(params) : '');
        // let subPath = '/public/get_book_summary_by_currency';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    /**
     * symbol: BTCPFC, BTCF20
     * @param params eg: {symbol: 'BTCPFC'}
     * @returns {Promise<unknown>}
     */
    getPosition: function (params) {
        let subPath = '/api/v2/user/positions';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    /**
     *
     * @param params
     * @returns {Promise<unknown>}
     */
    createOrder: function (body) {
        let subPath = '/api/v2/order';
        let options = prepareOptions('POST', subPath, null, body);

        return respPromise(options);
    },

    /**
     * symbol: BTCPFC, orderID: 6525e1a4-570b-4489-b913-545eeca2ca9d
     * @returns {Promise<unknown>} eg: {symbol: 'BTCPFC', orderID: '6525e1a4-570b-4489-b913-545eeca2ca9d'}
     */
    cancelOrder: function(params) {
        let subPath = '/api/v2/order';
        let options = prepareOptions('DELETE', subPath, params);

        return respPromise(options);
    },

    /**
     * @returns {Promise<unknown>} eg:
     */
    cancelAllOrder: function(params) {
        let subPath = '/api/v2/private/cancel_all' + (params ? "?" + queryString.stringify(params) : '');
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);
    },

    setLeverage: function(body) {
        let subPath = '/api/v2/leverage'

        let options = prepareOptions('POST', subPath, null, body);

        return respPromise(options);
    },

    /**
     * symbol: BTCPFC, type: LIMIT/MARKET
     * @returns {Promise<unknown>} eg: {symbol: 'LTCPFC', type: 'MARKET'}
     */
    closePosition: function(body) {
        let subPath = '/api/v2/order/close_position';
        let options = prepareOptions('POST', subPath, null, body);

        return respPromise(options);
    },
}

function respPromise(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (response && response.statusCode == 200) {
                // console.log(body);
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
    let timestamp = new Date().getTime();
    let nounce = timestamp;
    let url = deribitUrl + subPath;

    let requestData = (verb).toUpperCase() + '\n' + subPath + '\n' + '' + '\n';
    let stringToSign = timestamp + '\n' + nounce + '\n' + requestData;
    let signature = CryptoJS.HmacSHA256(stringToSign, clientSecret).toString();
    let authorization = 'deri-hmac-sha256 ' + 'id=' + clientId + ',ts=' + timestamp + ',sig=' + signature + ',nonce=' + nounce;
    // let authorization = 'Basic ' + Base64.encode(clientId + ':' + clientSecret);

    // console.log(authorization);
    let options = {
        method: verb,
        url: url,
        headers: {
            'Accept': 'application/json',
            'Authorization': authorization
            // 'id': clientId,
            // 'ts': timestamp,
            // 'sig': signature,
            // 'nonce': nounce
        },
        body: body,
    };

    // console.log(options);
    return options;
}