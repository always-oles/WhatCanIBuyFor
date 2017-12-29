const schedule      = require('node-schedule');
const axios         = require('axios');
const Config        = require('./config');
const Currencies    = require('./models/Currencies');
const mongoose      = require('mongoose');

// mongoose basic setup
mongoose.Promise = global.Promise;
mongoose.connect(Config.DB_URL, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// nice public currency exchange api
// we assume that USD = 1 and other currencies are related to this
const API_URL = `http://apilayer.net/api/live?access_key=${Config.CURRENCY_API_KEY}&currencies=UAH,EUR`;

// Get currencies rates from API and update them in DB
const updateCurrencies = () => {
    axios.get(API_URL)
    .then(response => {
        let data = response.data;

        // if we're good
        if (data && data.success === true && data.quotes) {

            // clear db
            Currencies.remove({}, () => {
                new Currencies({
                    UAH: data.quotes.USDUAH,
                    EUR: data.quotes.USDEUR
                }).save(() => {
                    console.log('updated currencies ', +new Date());
                });
            });
        }
    })
    .catch(error => {
        console.log(error);
    });
};

// schedule script to run every midnight and update currencies
schedule.scheduleJob('0 0 * * *', updateCurrencies);