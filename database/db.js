// // for creating fake data (faker.js)
// exports.resetTable = (table, cb) => {
//   con.query(`DELETE FROM ${table};`, () => {
//     console.log(`DELETED TABLE ${table}`);
//     con.query(`ALTER TABLE ${table} AUTO_INCREMENT=1;`, () => {
//       console.log(`RESET AUTO_INCREMENT for ${table}`);
//       cb();
//     });
//   });
// };


const pg = require('pg');

const client = new pg.Client({
  user: 'sonia',
  host: 'localhost',
  database: 'hackazon',
});

client.connect((err) => {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('database connected !');
  }
});

// =================== get from table ==========================
exports.getProduct = (id, cb) => {
  const query = `SELECT * from productInfo where id=${id}`;
  client.query(query, (err, res) => {
    if (err) {
      console.log('this is an error in db query', err);
    } else {
      cb(err, res.rows[0]);
    }
  });
};
// ====================== update table  ======================

exports.updateTable = (id, value, cb) => {
  client.query(`UPDATE productInfo SET sellerName = ? where id = ${id}`, value, cb);
};

// ====================== delete from table ====================
exports.deleteFromTable = (id, cb) => {
  client.query('delete from productInfo where id=?', id, cb);
};

// ====================== post to table =================

exports.addToTable = (data, cb) => {
  console.log(data.usedPrice);
  client.query(
    `INSERT INTO productinfo (id, productName, sellerName, ratingsAverage, ratingsCount, questionsCount,
     amazonsChoice, categoryName, priceList, price, freeReturns, freeShipping, soldByName, available, hasCountDown,
      description, usedCount, usedPrice, imageUrl, varKey, varValue) VALUES ( 
    ${data.id}, '${data.productName}', '${data.sellerName}', ${data.ratingsAverage}, ${data.ratingsCount}, ${data.questionsCount},
    ${data.amazonsChoice}, '${data.categoryName}', ${data.priceList}, ${data.price}, ${data.freeReturns},
    ${data.freeShipping}, '${data.soldByName}', ${data.available}, ${data.hasCountDown}, '${data.description}', ${data.usedCount}
    ${data.usedPrice}, '${data.imageUrl}', '${data.varKey}', '${data.varValue}')`, (err, res) => {
      console.log(err);
      cb(err, null);
    });
};
// ======================================================
// exports.insertRow = (query, cb) => {
//   con.query(query, (err, res) => {
//     if (err) {
//       console.log(err);
//     } else {
//       cb(res, con);
//     }
//   });
// };

// exports.getProduct = (id, cb) => {
//   con.query(`SELECT * FROM products WHERE id=${id}`, (err, result) => {
//     const productObj = result[0];
//     con.query(`SELECT * FROM images WHERE productId=${id}`, (error, res) => {
//       const imgArr = {};
//       for (let i = 0; i < res.length; i += 1) {
//         // init category object if does not exist
//         if (imgArr[res[i].varKey] === undefined) {
//           imgArr[res[i].varKey] = {};
//         }

//         // init category object's value arr if does not exist
//         if (imgArr[res[i].varKey][res[i].varValue] === undefined) {
//           imgArr[res[i].varKey][res[i].varValue] = [];
//         }

//         // add image url to array
//         imgArr[res[i].varKey][res[i].varValue].push(res[i].imageUrl);
//       }

//       if (productObj) {
//         productObj.images = imgArr;
//       }
//       cb(productObj);
//     });
//   });
// }
