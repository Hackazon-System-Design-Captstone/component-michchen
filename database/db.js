const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'amazon',

});

con.connect((err) => {
  if (err) {
    console.log('db.js > connection error', err);
  } else {
    console.log('connection success!');
  }
});


// for creating fake data (faker.js)
exports.resetTable = (table, cb) => {
  con.query(`DELETE FROM ${table};`, () => {
    console.log(`DELETED TABLE ${table}`);
    con.query(`ALTER TABLE ${table} AUTO_INCREMENT=1;`, () => {
      console.log(`RESET AUTO_INCREMENT for ${table}`);
      cb();
    });
  });
};

// ====================== update table  ======================

exports.updateTable = (id, value, cb) => {
  con.query(`UPDATE products SET sellerName = ? where id = ${id}`, value, cb);
  con.query(`UPDATE images SET productId = ? where id = ${id}`, value, cb);
};

// ====================== delete from table ====================
exports.deleteFromTable = (id, cb) => {
  con.query('delete from products where id=?', id, cb);
  con.query('delete from images where id=?', id, cb);
};

// ====================== post to table ===================

exports.addToTable = (data, cb) => {
  con.query('INSERT INTO products (productName, sellerName, ratingsAverage, ratingsCount, questionsCount, amazonChoice, categoryName, price, priceList, freeReturns, freeShipping, soldByName, available, hasCountdown, description, usedCount, usedPrice) VALUES ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?', data, cb);
  con.query('INSERT INTO images (productId, imageUrl, varKey, varValue) VALUES ?, ?, ?, ?', data, cb);
};

// ======================================================
exports.insertRow = (query, cb) => {
  con.query(query, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      cb(res, con);
    }
  });
};

exports.getProduct = (id, cb) => {
  con.query(`SELECT * FROM products WHERE id=${id}`, (err, result) => {
    const productObj = result[0];
    con.query(`SELECT * FROM images WHERE productId=${id}`, (error, res) => {
      const imgArr = {};
      for (let i = 0; i < res.length; i += 1) {
        // init category object if does not exist
        if (imgArr[res[i].varKey] === undefined) {
          imgArr[res[i].varKey] = {};
        }

        // init category object's value arr if does not exist
        if (imgArr[res[i].varKey][res[i].varValue] === undefined) {
          imgArr[res[i].varKey][res[i].varValue] = [];
        }

        // add image url to array
        imgArr[res[i].varKey][res[i].varValue].push(res[i].imageUrl);
      }

      if (productObj) {
        productObj.images = imgArr;
      }
      cb(productObj);
    });
  });
}
