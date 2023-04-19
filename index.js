const express = require("express");
const ProductService = require("./ProductService");
const ProductUtility = require("./ProductUtility");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////GET HOMEPAGE//////
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//////GET PRODUCTS//////
app.get("/products", async (req, res) => {
  let products = await ProductService.getProducts();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  let id = req.params.id;
  //id validation
  try {
    if(isNaN(id))
    {
      throw new TypeError("Invalid id");
    }    
  } catch (error) {
    console.log(error.name,":",error.message);
    res.status(400).json({
      message : "Invalid id"
    });
    return;
  }
  let product = await ProductService.getProductById(id);
  if (!product) {
    res.status(404).send("Product not found");
  } else res.status(200).json(product);
});

////ADD PRODUCTS//////
app.post("/products", async (req, res) => {
  let productInput = req.body;
  //validations
  try {
    const validationError = ProductUtility.isValidInputProduct(productInput);
    // console.log(validationError);
    if (validationError) {
      throw new ReferenceError(`${validationError}`);
    }
  } catch (error) {
    console.log(error.name,":",error.message);
    res.status(400).json({
      error: error.message
    });
    return;
  }

  const result = await ProductService.addProduct(productInput);
  if(!result) res.status(400).json({
    error:"Duplicate Entry",
  })
  else res.status(201).json(result);
});

////PORT LISTEN/////
app.listen(port, () => {
  console.log(`Product app listening on port ${port}`);
});
