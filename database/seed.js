/* HOW TO USE */
// set numToGenerate below
// run "node database/faker.js" in the terminal
// node database/seed.js

// const numToGenerate = 100;

/*
INSERT INTO products (id, productName, productUrl, sellerName, sellerUrl,
ratingsAverage, ratingsCount, questionsCount, categoryName, categoryUrl,
price, priceList, freeReturns, freeShipping, soldByName, soldByUrl, available,
description, usedCount, usedPrice) VALUES (101, "LG G6+ - 128 GB - Unlocked
(AT&T/T-Mobile/Verizon) - Black - Prime Exclusive", "#", "LG", "#", 4, 80, 86,
"Cell Phones & Accessories", "#", 40999, 79999, 1, 1, "Some sketchy guy", "#",
1, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare augue non
eleifend accumsan. \nMaecenas sit amet maximus lacus. Nullam eu placerat metus,
et aliquet ex. Vivamus justo magna, tincidunt a convallis eu, semper vitae nunc.
\nSed tincidunt quis purus vitae dictum. \nDonec eu ante pharetra, maximus erat
sit amet, imperdiet odio. \nIn tincidunt feugiat ligula, quis tempus leo eleifend
in. Pellentesque vitae lectus est.", 20, 30749);

INSERT INTO images (productId,varKey,varValue,imageUrl) VALUES (101, "","",
"https://images-na.ssl-images-amazon.com/images/I/61Rh3tVbr-L._SL1200_.jpg");
*/

const faker = require('faker');
const cats = require('./cats');

// possible product variations to choose from
const variations = [
  {
    category: 'color',
    data: ['Medium Spring Green', 'Coral', 'Lawn Green', 'Yellow', 'Orange', 'Light Steel Blue', 'Fire Brick', 'Light Grey', 'Dark Goldenrod', 'Burly Wood', 'Dark Slate Blue', 'Cornflower Blue', 'Powder Blue', 'Dark Blue', 'Dark Slate Gray', 'Maroon', 'Silver', 'Light Salmon', 'Seashell', 'Medium Sea Green'],
  },
  {
    category: 'size',
    data: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
  },
];

exports.truncateToDecimalPlace = function truncateToDecimalPlace(num, places) {
  let placesCopy = places || 0;
  placesCopy = 10 ** placesCopy;
  return Math.round(num * placesCopy) / placesCopy;
};

exports.randomNumFromRange = function randomNumFromRange(
  lowerBound, upperBound, growthRate, decimalPlaces,
) {
  let growthRateCopy;
  if (growthRate === undefined || growthRate === 'exp') {
    // more low numbers
    growthRateCopy = 2;
  } else if (growthRate === 'log') {
    // more high numbers. a higher denominator means on average higher nums are generated
    growthRateCopy = 1 / 1.5;
  }
  return exports.truncateToDecimalPlace((Math.random() ** growthRateCopy)
        * (upperBound - lowerBound) + lowerBound, decimalPlaces);
};

exports.createProductQuery = function createProductQuery(howMany) {
  let queryConcat = 'INSERT INTO products (productName, sellerName, ratingsAverage, ratingsCount, questionsCount, amazonsChoice, categoryName, priceList, price, freeReturns, freeShipping, soldByName, available, hasCountdown, description, usedCount, usedPrice) VALUES ';

  for (let i = 0; i < howMany; i += 1) {
    if (i > 0) {
      queryConcat += ',';
    }

    // the 9 is to put the price within an affordable range haha
    const listPrice = parseInt(faker.commerce.price() / 9, 10);

    // price is between 80% to 95% of the list price
    const price = listPrice * (exports.randomNumFromRange(80, 95) / 100);

    // used price is between 50% to 95% of the price
    const usedPrice = price * (exports.randomNumFromRange(50, 95) / 100);

    // generate a random sequence of departments for breadcrumb
    let department = `${faker.commerce.department()}`;
    const times = Math.round(Math.random() * 4) + 1;
    Array(times).fill('').forEach(() => {
      department += `\n${faker.commerce.department()}`;
    });

    queryConcat += `(
"${/* productName */faker.commerce.productName()}",\
"${/* sellerName */faker.company.companyName()}",\
"${/* ratingsAverage */exports.randomNumFromRange(0.5, 5, 'log', 1)}",\
"${/* ratingsCount */exports.randomNumFromRange(5, 1000)}",\
"${/* questionsCount */exports.randomNumFromRange(2, 30, 'log')}",\
"${/* amazonsChoice */exports.randomNumFromRange(0, 1)}",\
"${/* categoryName */department}",\
"${/* priceList */listPrice}",\
"${/* price */price}",\
"${/* freeReturns */exports.randomNumFromRange(0, 1)}",\
"${/* free_shipping */exports.randomNumFromRange(0, 1)}",\
"${/* sold_byName */faker.company.companyName()}",\
"${/* available */exports.randomNumFromRange(0, 1, 'log')}",\
"${/* hasCountdown */exports.randomNumFromRange(0, 1)}",\
"${/* description */faker.lorem.lines().replace(/\n/g, '\\n')}",\
"${/* usedCount */exports.randomNumFromRange(1, 20)}",\
"${/* usedPrice */usedPrice}"\
)`;
  }
  // end for loop

  return `${queryConcat};`;
};

exports.createImageQuery = function createImageQuery(howMany) {
  let queryConcat = 'INSERT INTO images (productId,varKey,varValue,imageUrl) VALUES ';
  let imindex = 0;

  // for each productId, adKa new quVy to the queryConcat string
  for (let productID = 1; productID <= howMany; productID += 1) {
    const categoryObj = variations[Math.round(Math.random())];

    // loop through a few items at a random section of the array
    const randStart = Math.round(Math.random() * (categoryObj.data.length / 2));
    const maxItems = 5;
    const randEnd = randStart + Math.ceil(Math.random() * maxItems);

    for (let j = randStart; j < randEnd; j += 1) {
      if (imindex > 0) {
        queryConcat += ',';
      }
      queryConcat += `(\
"${/* productId */productID}",\
"${/* var_key */categoryObj ? categoryObj.category : ''}",\
"${/* var_value */categoryObj ? categoryObj.data[j] : ''}",\
"${/* imageUrl */cats.data[imindex % cats.data.length]}"\
)`;
      imindex += 1;
    }
  }

  return `${queryConcat};`;
};

// console.log(exports.createProductQuery(100));


// reset products table and insert rows
// db.resetTable('products', () => {
//   db.insertRow(exports.createProductQuery(numToGenerate), () => {
//     console.log(`  INSERTED ${numToGenerate} ROWS into products`);

//     // reset images table and insert rows
//     db.resetTable('images', () => {
//       db.insertRow(exports.createImageQuery(numToGenerate), () => {
//         // log success
//         console.log(`  INSERTED ${numToGenerate} ROWS into images`);
//         console.log('Data generation finished. Press ctrl-C to exit.');
//       });
//     });
//   });
// });
// console.log('success in seeding');
