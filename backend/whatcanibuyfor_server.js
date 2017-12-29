const helmet        = require('helmet');
const bodyParser    = require('body-parser');
const express       = require('express');
const app           = express();
const mongoose      = require('mongoose');
const path          = require('path');
const Product       = require('./models/Product');
const Config        = require('./config');

// mongoose basic setup
mongoose.Promise = global.Promise;
mongoose.connect(Config.DB_URL, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let router = express.Router();

/**
 * Frontend currencies to DB format
 * @param {String} input 
 */
const currencyToDBFormat = (input) => {
  const currencies    = ['UAH', 'USD', 'EUR'];
  const dbCurrencies  = ['грн', '$', '€'];

  if (currencies.indexOf(input) >= 0) {
    return dbCurrencies[currencies.indexOf(input)];
  }
  return false;
};

/**
 * Get random products from DB by price and currency
 * @param {Object} body includes price and currency 
 * @param {Object} response to send response
 */
const getRandomProducts = (body, response) => {
  let basicPrice, currency = currencyToDBFormat(body.currency);

  // check price
  if (body.price) {
    basicPrice = +body.price;   
  }

  // check currency
  if (!currency) {
    return response.json({
      type: 'API input data error',
      body: 'there is no such currency'
    });
  }

  // get products
  Product.aggregate([
      { $match: { 
        'currency': currency,
        'price': { $lt: basicPrice }
      }},
      { $sample: { size: 6 }}
  ], (error, result) => {

    // if we got an array - remake it and send as response
    if (result.length) {

      // maps response to demanded format
      let items = result.map(item => ({
          quantity: Math.floor(basicPrice / item.price),  
          title: item.title,
          price: item.price,
          url: item.url,
          picture: item.picture
      }));

      response.json(items);
    } else {
      // TBA
    }

  });
};

router.route('/whatElseCanIGet')
  .post((request, response) => {
    
    // get products from db
    getRandomProducts(request.body, response);
  }); 

app.use('/', router);
app.listen(3000, () => console.log('server started'));