const helmet        = require('helmet');
const bodyParser    = require('body-parser');
const express       = require('express');
const app           = express();
const mongoose      = require('mongoose');
const path          = require('path');
const Product       = require('./models/Product');
const Config        = require('./config');

// mongoose basic setup, thanks stack overflow
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

const aggregateAndReturnStats = (response) => {
  User.aggregate([
      { $match: { deleted: {$ne: 1 } }},
      {
          $group: { 
              _id: null, 
              totalBookmarks: { 
                  $sum: '$stats.bookmarksCount' 
              },
              totalPostponed: { 
                  $sum: '$stats.bookmarksPostponed' 
              },
              totalVisited: {
                  $sum: '$stats.bookmarksVisited'
              },
              totalVisitedManually: {
                  $sum: '$stats.bookmarksVisitedManually'
              },
              count: {
                  $sum: 1
              }
          }
      }
  ], (error, result) => {
      response.json(result[0]);
  });
};

router.route('/whatElseCanIGet')
  .post((request, response) => {
    db.products.aggregate([
      {$match: {category:"Electronic Devices"}}, // filter the results
      {$sample: {size: 5}} // You want to get 5 docs
    ]);

    console.log(request.body);
    response.json('Hello World!');
  }); 

app.use('/', router);
app.listen(3000, () => console.log('server started'));