const CryptoJS = require('crypto-js');
const request = require('request');
const queryString = require('query-string');
const settings = require('../settings');

let btseUrl = settings.BTSE.btseUrl;
let btseApi = settings.BTSE.btseApi;
let btseSecret = settings.BTSE.btseSecret;

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
        let subPath = '/api/v2/user/margin';
        let options = prepareOptions('GET', subPath, params);

        return respPromise(options);

    },

    /**
     * symbol: BTCPFC, BTCF20
     * @param params eg: {symbol: 'BTCPFC'}
     * @returns {Promise<unknown>}
     */
    getOpenOrder: function (params) {
        let subPath = '/api/v2/user/open_orders';
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
                // console.log(JSON.parse(body));
                // console.log(response.statusCode);
                resolve(JSON.parse(body));
            } else if (response) {
                console.log(body);
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
    let url = btseUrl + "/futures" + subPath + (params ? "?" + queryString.stringify(params) : '');

    // console.log(path);
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

    // console.log(options);
    return options;
}