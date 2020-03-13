const deribit = require('./deribit');

deribit.getOpenOrder({currency: 'BTC', kind: 'future', type: 'all'}).then(resp => console.log(resp)).catch(err => console.error(err));
deribit.cancelAllOrder().then(resp => console.log(resp)).catch(err => console.error(err));


