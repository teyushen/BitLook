const CryptoJS = require('crypto-js');
const request = require('request');
const queryString = require('query-string');
const settings = require('../settings');

let bitMEXUrl = settings.BitMEX.bitMEXUrl;
let bitMEXApi = settings.BitMEX.bitMEXApi;
let bitMEXSecret = settings.BitMEX.bitMEXSecret;

module.exports = {

    /**
     *
     * @param params {symbol: 'XBTUSD', depth: 1}
     * @returns {Promise<any>}
     */
    getOrderBook: function(params) {
        let subPath = '/api/v1/orderBook/L2' + (params ? "?" + queryString.stringify(params) : '');
        let options = prepareOptions('GET', subPath);

        return respPromise(options);
    },

    /**
     *
     * @param data eg: {symbol: 'XBTUSD', orderQty: 20}
     * @returns {Promise<any>}
     */
    createOrder: function (data) {
        let subPath = '/api/v1/order';
        let options = prepareOptions('POST', subPath, data);

        return respPromise(options);
    },

    /**
     *
     * @param params eg: {symbol: 'XBTUSD', filter: {open: true}}
     * @returns {Promise<any>}
     */
    getOrder: function (params) {
        let subPath = '/api/v1/order' + (params ? "?" + queryString.stringify(params) : '');
        let options = prepareOptions('GET', subPath);

        return respPromise(options);
    },

    /**
     *
     * @param data {symbol: 'XBTUSD'}
     * @returns {Promise<boolean>}
     */
    closePosition: async function (data) {
        let subPath = '/api/v1/order/closePosition';
        let options = prepareOptions('POST', subPath, data);

        let success = false;
        await respPromise(options).then(resp => success = true).catch(error => success = false);
        return success;
    },

    /**
     *
     * @param data {symbol: 'XBTUSD'}
     * @returns {Promise<boolean>}
     */
    getPosition: function (params) {
        let subPath = '/api/v1/position' + (params ? "?" + queryString.stringify(params) : '');
        let options = prepareOptions('GET', subPath);

        return respPromise(options);
    },
}

function respPromise(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (response && response.statusCode == 200) {
                // console.log(JSON.parse(body));
                resolve(JSON.parse(body));
            } else if(response){
                // console.log(body);
                reject(body);
            } else {
                // console.log(error);
                reject(error);
            }
        });
    })
}



function prepareOptions(verb, subPath, body) {
    let expires = Math.round(new Date().getTime() / 1000) + 60;
    body = body ? JSON.stringify(body) : '';
    let path = verb + subPath + expires + body;
    let sign = CryptoJS.HmacSHA256(path, bitMEXSecret).toString();
    let url = bitMEXUrl + subPath;

    let options = {
        method: verb,
        url: url,
        headers: {
            'content-type' : 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'api-expires': expires,
            'api-key': bitMEXApi,
            'api-signature': sign
        },
        body: body
    };

    return options;
}