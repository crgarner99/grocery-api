// Importing external packages -Common JS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const DAL = require("./DAL");
const { ObjectId, ObjectID } = require("mongodb");
DAL.connect();

//Creating server
const app = express();

//Installing the CORS middleware
// allows us (the server) to respond to requests from a different origin (URL)

app.use(cors());

// Installing the body-parser middleware
// Allow us to read JSON from requests

app.use(bodyParser.json());

//get all
//GET
app.get("/api/products", async (req, res) => {
  const products = await DAL.findAll();

  res.send(products);
});

// get a specific product by id
// GET api/products/(id)
app.get("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  if (!ObjectID.isValid(productId)) {
    res
      .status(400)
      .send(
        `ProductID ${productId} is incorrect. ID must be 25 characters long.`
      );
    return;
  }

  const productQuery = {
    _id: new ObjectId(productId),
  };
  let product;

  try {
    product = await DAL.findOne(productQuery);
  } catch (error) {
    res.status(404).send(`Product with id ${productId} not found!`);
    return;
  }
  res.send(product);
});

//Create a new product
//POST
app.post("/api/products", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.price || !body.category) {
    res
      .status(400)
      .send("Bad Request. Validation Error. Missing name, price, or category!");
    return;
  }

  //Validate data types of properties
  // name = non-empty string
  // price = number > 0
  // category = non-empty string

  if (body.name && typeof body.name !== "string") {
    res.status(400).send("The name parameter must be a type of string.");
    return;
  }

  if (body.name && typeof body.category !== "string") {
    res.status(400).send("The category parameter must be a type of string.");
    return;
  }

  if (body.price && isNaN(Number(body.price))) {
    res
      .status(400)
      .send("The price parameter must be a number and greater than 0");
    return;
  }

  await DAL.insertOne(body);

  res.status(201).send("Item added Successfully!");
});

//Update existing product
//PUT
app.put("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  const body = req.body;

  if (!ObjectID.isValid(productId)) {
    res
      .status(400)
      .send(
        `ProductID ${productId} is incorrect. ID must be 25 characters long.`
      );
    return;
  }

  const productQuery = {
    _id: new ObjectId(productId),
  };

  try {
    await DAL.updateOne(productQuery, body);
  } catch (error) {
    res.status(404).send(`Product with id ${productId} not found!`);
    return;
  }

  res.send("Good to Go!");
});

//Delete a product
//DELETE
app.delete("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  if (!ObjectID.isValid(productId)) {
    res
      .status(400)
      .send(
        `ProductID ${productId} is incorrect. ID must be 25 characters long.`
      );
    return;
  }

  const productQuery = {
    _id: new ObjectId(productId),
  };

  try {
    await DAL.deleteOne(productQuery);
  } catch (error) {
    res.status(404).send(`Product with id ${productId} not found!`);
    return;
  }

  res.send(`Item with ID ${productId} has been deleted.`);
});

// Defining our HTTP resource methods
// Endpoints
// Routes

// Starting my server
const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("Grocery API Server has started!");
});
