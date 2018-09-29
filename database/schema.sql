  DROP DATABASE IF EXISTS hackazon;
  CREATE DATABASE hackazon;
  CREATE SCHEMA myschema;
  
  CREATE TABLE  hackazon.productInfo (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  productName VARCHAR(150),
  sellerName VARCHAR(150),
  ratingsAverage FLOAT,
  ratingsCount INT,
  questionsCount INT,
  amazonsChoice INT,
  categoryName VARCHAR(255),
  price FLOAT,
  priceList FLOAT,
  freeReturns BOOLEAN,
  freeShipping BOOLEAN,
  soldByName VARCHAR(150),
  available INT,
  hasCountdown INT,
  description TEXT,
  usedCount INT,
  usedPrice INT,
  productId INT,
  imageUrl VARCHAR(255),
  varKey VARCHAR(150),
  varValue VARCHAR(150)

  );
  
  COPY hackazon.productInfo FROM './randomData.csv' CSV HEADER
  

  
