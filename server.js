// require('dotenv').config();
require('newrelic');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const db = require('./database/db.js');

const corsOptions = {
  origin: 'http://localhost:9002',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/', express.static(path.join(__dirname, '/client/dist')));
app.use((req, res, next) => {
  console.log(`${req.method} request received at ${req.url}`);
  next();
});


// get route ================

app.get('/get', (req, res) => {
  // req.query is the URL query string, and 'id' is the product id i wish to fetch
  db.getProduct(req.query.id, (err, data) => {
    if (err) {
      res.status(503).send(err);
      console.log('error in server app.get');
    } else {
      console.log('this is data', data);
      res.header('Access-Control-Allow-Origin', '*');
      const {
        id, productname, sellername, ratingsaverage, ratingscount, questionscount, amazonschoice, categoryname, pricelist, price, freereturns, freeshipping, soldbyname, available, hascountdown, description, usedcount, usedprice, imageurl, varkey, varvalue,
      } = data;
      const camelCasedData = {
        productName: productname,
        sellerName: sellername,
        ratingsAverage: ratingsaverage,
        ratingsCount: ratingscount,
        questionsCount: questionscount,
        amazongsChoice: amazonschoice,
        categoryName: categoryname,
        priceList: pricelist,
        price,
        freeReturns: freereturns,
        freeShipping: freeshipping,
        soldByName: soldbyname,
        available,
        hasCountdown: hascountdown,
        description,
        usedCount: usedcount,
        usedPrice: usedprice,
        id,
        varKey: varkey,
        varValue: varvalue,
        imageUrl: imageurl,
      };
      res.send(camelCasedData);
    }
  });
});

// post route ================

app.post('/productInfo', bodyParser.json(), (req, res) => {
  db.addToTable(req.body, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send();
    }
  });
  res.send('POST request received');
});

// put route =================

app.put('/productInfo/:id', bodyParser.json(), (req, res) => {
  db.updateTable(req.params.id, req.body, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send();
    }
  });
  res.send('UPDATE request received');
});

// delete route ==============

app.delete('/productInfo/:id', (req, res) => {
  db.deleteFromTable(req.params.id, (err) => {
    if (err) {
      res.status(503).send(err);
    } else {
      res.status(201).send();
    }
  });
  res.send('DELETE request received');
});

//= ==========================
app.listen(9002, () => {
  console.log('listening on 9002');
});
