const helmet        = require('helmet');
const bodyParser    = require('body-parser');
const express       = require('express');
const app           = express();
const mongoose      = require('mongoose');
const path          = require('path');
const Config        = require('./config');

// DB Models
const Product       = require('./models/Product');
const Request       = require('./models/Request');
const Removal       = require('./models/Removal');

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
  if (body.price && !isNaN(+body.price)) {
    basicPrice = +body.price;   
  } else {
    return response.json({
      type: 'API input data error',
      body: 'price is not a number'
    });
  }
  
  // check currency
  if (!currency) {
    return response.json({
      type: 'API input data error',
      body: 'there is no such currency'
    });
  }

  // get random products
  Product.aggregate([
      { $match: {
        'currency': currency,
        'price': { $lt: basicPrice }
      }},
      { $sample: { size: 4 }}
  ], (error, result) => {

    // if we got an array - remake it and send as response
    if (result.length) {

      // maps response to demanded format
      let items = result.map(item => ({
          id: item._id,
          count: Math.floor(basicPrice / item.price),  
          title: item.title,
          price: item.price,
          currency: item.currency,
          url: item.url,
          photo: item.picture
      })).sort((a, b) => a.count > b.count);

      response.json(items);
    } else {
      // TBA
    }

  });
};

router.route('/api/voteForRemoval')
  .post((request, response) => { 

    const requestData = {
      ip: request.ip,
      itemTitle: request.body.title,
      itemId: request.body.id
    };

    // save removal vote to db
    const R = new Removal(requestData).save((e) => {

      // upon duplicate - find and update
      if (e && e.code === 11000) {

        // find our vote and increment votes counter
        Removal.findOne({ itemId: requestData.itemId }, (error, vote) => {
          if (!error) {
            vote.votes++;
            vote.save();
          }
        });
      }
    });

    response.json('ok');
  }); 


router.route('/api/whatElseCanIGet')
  .post((request, response) => {
    const requestData = Object.assign({}, request.body, {ip: request.ip});

    // save request to db
    const R = new Request(requestData).save();

    // get products from db
    getRandomProducts(request.body, response);
  });

router.route('/api/suggestions')
  .get((request, response) => {

    // lets get some random items
    Product.aggregate([ 
      {$match : 
          {title: 
              {$regex: /^.{1,30}$/ig }
          }
      },
      {$sample: {size: 25}}
    ], 
      (error, items) => {
        if (error) { response.json(error); }
        
        // remove all unwanted stuff from items
        items = items.filter(item => !/прода/i.test(item.title));

        response.json(items);
      }
    );
  }); 

app.use('/', router);
app.listen(3000, () => console.log('server started'));