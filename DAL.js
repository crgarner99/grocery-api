const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

//Gran env variables
const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

console.log(url);
console.log(databaseName);

const collectionName = "products";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let productCollection;

//connect()
const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      productCollection = databaseClient.collection(collectionName);
      console.log("Successfully Connected to Database!");
      resolve();
    });
  });
};

// INSERT ONE DOCUMENT
// insertOne()
const insertOne = function (product) {
  return new Promise((resolve, reject) => {
    productCollection.insertOne(product, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("Successfully Inserted a New Document");
      resolve();
    });
  });
};

//FIND ALL DOCUMENTS
//findAll()
const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    productCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`Successfully Found ${documents.length} Documents.`);
      resolve(documents);
    });
  });
};

//FIND ONE DOCUMENT
//findOne()
const findOne = function (query) {
  return new Promise((resolve, reject) => {
    productCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("Successfully Found Document!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No Document Found!");
      }
    });
  });
};

// UPDATE ONE DOCUMENT
//updateOne()
const updateOne = function (query, newProduct) {
  const newProductQuery = {};

  if (newProduct.name) {
    newProductQuery.name = newProduct.name;
  }

  if (newProduct.price) {
    newProductQuery.price = newProduct.price;
  }

  if (newProduct.category) {
    newProductQuery.category = newProduct.category;
  }

  return new Promise((resolve, reject) => {
    productCollection.updateOne(
      query,
      { $set: newProductQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Document Found");
          reject("No Document Found");
          return;
        }

        console.log("Successfully Updated Document!");
        resolve();
      }
    );
  });
};

// DELETE ONE DOCUMENT
//deleteOne()
const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    productCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }

      console.log("Successfully Deleted Document!");
      resolve();
    });
  });
};

//Make all functions available to javascript files
//Common JS export

module.exports = { connect, insertOne, findAll, updateOne, deleteOne, findOne };

// Test Code For Development

// (async () => {
// run node DAL

// await connect();

//   const newProduct = {
//     name: "Oranges",
//     price: 1.99,
//     category: "produce",
//   };
//   await insertOne(newProduct);

//Test findAll()
// const products = await findAll();
// console.log(products);

//Test findOne()
// const productQuery = {
//   // _id: new ObjectId("5f20e12da4a3e35ff08e1646"),
//   // name: "Apples",
// };
// const product = await findOne(productQuery);
// console.log(product);

// Test updateOne()
// const productQuery = {
//   _id: new ObjectId("5f20e12da4a3e35ff08e1646"),
// };
// const newProduct = {
//   name: "Crunchy Peanut Butter",
//   price: 99.99,
//   category: "grocery",
// };
// await updateOne(productQuery, newProduct);

//Test deleteOne()
//   const productQuery = {
//     _id: new ObjectId("5f20e12da4a3e35ff08e1646"),
//   };
//   await deleteOne(productQuery);
//   console.log("End");
//   process.exit(0);
// })();
