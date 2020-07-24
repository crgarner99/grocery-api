// Importing external packages -Common JS
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { response } = require("express");

//Creating server
const app = express();

// Installing the body-parser middleware
// Allow us to read JSON from requests

app.use(bodyParser.json());

// Read in JSON File (mock Database)
let products = [];

try {
  products = JSON.parse(fs.readFileSync("products.json")).products;
} catch (error) {
  console.log("No exisiting file.");
}

//get all
//GET
app.get("/api/products", (req, res) => {
  res.send(products);
});

// get a specific product by id
// GET api/products/(id)
app.get("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  const product = products.find((p) => {
    if (productId === p.id) {
      return true;
    }
  });

  if (!product) {
    res.send(`Product with id ${productId} not found - 404`);
    return;
  }

  res.send(product);
});

//Create a new product
//POST
app.post("/api/products", (req, res) => {
  const body = req.body;
  if (!body.id || !body.name || !body.price) {
    res.send("Bad Request. Validation Error. Missing id, name or price");
    return;
  }
  products.push(body);
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
  res.send("Item added Successfully!");
});

//Update existing product
//PUT
app.put("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  const product = products.find((p) => {
    return productId === p.id;
  });

  if (!product) {
    res.send(`Product with id ${productId} not found -404`);
    return;
  }

  const body = req.body;

  if (body.name || body.price) {
    product.name = body.name;
    product.price = body.price;
  }
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  res.send("Good to Go!");

  /*
  if (body.name) {
    product.name = body.name;
  }
  if (body.price) {
    product.price = body.price;
  }
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  res.send("All Done!");
  */
});

//Delete a product
//DELETE
app.delete("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  const productIndex = products.findIndex((p) => {
    return productId === p.id;
  });

  if (productIndex === -1) {
    res.send(`Product with ID ${productId} not found -404`);
  }

  products.splice(productIndex, 1);

  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
  res.send(`Item with ID ${productId} has been deleted.`);
});

// Defining our HTTP resource methods
// Endpoints
// Routes

// Starting my server
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Grocery API Server has started!");
});
