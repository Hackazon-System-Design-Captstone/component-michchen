const fs = require('fs');
const faker = require('faker');
const cats = require('./cats');

// ================================================ data generating functions =====================

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
const truncateToDecimalPlace = (num, places) => {
  let placesCopy = places || 0;
  placesCopy = 10 ** placesCopy;
  return Math.round(num * placesCopy) / placesCopy;
};
const randomNumFromRange = (lowerBound, upperBound, growthRate, decimalPlaces) => {
  let growthRateCopy;
  if (growthRate === undefined || growthRate === 'exp') {
    // more low numbers
    growthRateCopy = 2;
  } else if (growthRate === 'log') {
    // more high numbers. a higher denominator means on average higher nums are generated
    growthRateCopy = 1 / 1.5;
  }
  return truncateToDecimalPlace(
    Math.random() ** growthRateCopy * (upperBound - lowerBound) + lowerBound, decimalPlaces,
  );
};

// generate a random sequence of departments for breadcrumb
let department = `${faker.commerce.department()}`;
const times = Math.round(Math.random() * 4) + 1;
Array(times).fill('').forEach(() => {
  department += `\n${faker.commerce.department()}`;
});
// the 9 is to put the price within an affordable range haha
const listPrices = parseInt(faker.commerce.price() / 9, 10);

// price is between 80% to 95% of the list price
const prices = () => {
  const newLocal = listPrices * (randomNumFromRange(80, 95) / 100);
  return newLocal;
};

// used price is between 50% to 95% of the price
const usedPrices = () => {
  const newLocal = prices() * (randomNumFromRange(50, 95) / 100);
  return newLocal;
};

// random key and value generation
let randomItem;
const categoryKey = () => {
  const categories = ['color', 'size'];
  randomItem = categories[Math.floor(Math.random() * categories.length)];
  return randomItem;
};

const categoryValue = () => {
  let randomVal;
  const colors = ['Medium Spring Green', 'Coral', 'Lawn Green', 'Yellow', 'Orange', 'Light Steel Blue', 'Fire Brick', 'Light Grey', 'Dark Goldenrod', 'Burly Wood', 'Dark Slate Blue', 'Cornflower Blue', 'Powder Blue', 'Dark Blue', 'Dark Slate Gray', 'Maroon', 'Silver', 'Light Salmon', 'Seashell', 'Medium Sea Green'];
  const sizes = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
  if (randomItem === 'color') {
    randomVal = colors[Math.floor(Math.random() * colors.length)];
  } else {
    randomVal = sizes[Math.floor(Math.random() * sizes.length)];
  }
  return randomVal;
};


// generate random imageUrl

const randomUrl = () => {
  const random = cats.data[Math.floor(Math.random() * (cats.data).length)];
  return random;
};

// ======================================= generating 10M random data =====================

// const stream = fs.createWriteStream('./randomData.csv');
const file = fs.createWriteStream('./randomData.csv');
let data = 'productName,sellerName,ratingsAverage,ratingsCount,questionsCount,amazonsChoice,categoryName,priceList,price,freeReturns,freeShipping,soldByName,available,hasCountDown,description,usedCount,usedPrice,imageUrl,varKey,varValue';
let rounds = 50;
const generateRandomData = () => {
  for (let j = 1; j <= 200000; j += 1) {
    let productName = `Clean-O-Bot${j}`;
    let sellerName = faker.company.companyName();
    let ratingsAverage = randomNumFromRange(0.5, 5, 'log', 1);
    let ratingsCount = randomNumFromRange(5, 1000);
    let questionsCount = randomNumFromRange(2, 30, 'log');
    let amazonsChoice = randomNumFromRange(0, 1);
    let categoryName = department;
    let priceList = listPrices;
    let price = prices();
    let freeReturns = randomNumFromRange(0, 1);
    let freeShipping = randomNumFromRange(0, 1);
    let soldByName = `best-company${j}`;
    let available = randomNumFromRange(0, 1, 'log');
    let hasCountDown = randomNumFromRange(0, 1);
    let description = faker.lorem.lines().replace(/\n/g, '\\n');
    let usedCount = randomNumFromRange(1, 20);
    let usedPrice = usedPrices();
    let imageUrl = randomUrl();
    let varKey = categoryKey();
    let varValue = categoryValue();

    data += `${productName},${sellerName},${ratingsAverage},${ratingsCount},${questionsCount},${amazonsChoice},${categoryName},${priceList},${price},${freeReturns},${freeShipping},${soldByName},${available},${hasCountDown},${description},${usedCount},${usedPrice},${imageUrl},${varKey},${varValue}\n`;

    productName = null;
    sellerName = null;
    ratingsAverage = null;
    ratingsCount = null;
    questionsCount = null;
    amazonsChoice = null;
    categoryName = null;
    priceList = null;
    price = null;
    freeReturns = null;
    freeShipping = null;
    soldByName = null;
    available = null;
    hasCountDown = null;
    description = null;
    usedCount = null;
    usedPrice = null;
    imageUrl = null;
    varKey = null;
    varValue = null;
  }
  if (rounds > 0) {
    rounds -= 1;
    let drainThis = file.write(data);
    if (!drainThis) {
      drainThis = true;
      data = '';
      console.log( 50 - rounds);
      file.once('drain', (err) => {
        if (err) {
          console.log('error');
        } else {
          generateRandomData();
        }
      });
      return;
    }
  }
};
generateRandomData();
  

  // fs.appendFile('./randomData.csv', data, (error) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     data = '';
  //     for (let i = 1; i <= 20; i += 1) {
  //       console.log(i);
  //       generateRandomData();
  //     }
  //   }
  // });

  // fs.appendFile('',data,'utf8') <= after creating a batch is done so inside of loop
  // fs.write(data into a file  , in the callback if not error, recurse) <= outside of loop


// fs.writeFile('./randomData.csv', data, (error) => {
//   if (error) {
//     throw error;
//   }
//   for (let i = 1; i <= 20; i += 1) {
//     console.log(i);
//     generateRandomData();
//   }
// });
