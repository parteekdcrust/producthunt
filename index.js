const express = require("express");
const ProductService = require("./ProductService");
const ProductUtility=require('./ProductUtility');
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
  let product = await ProductService.getProductById(id);
  if (!product || !product[0]) {
    res.status(404).send("Product not found");
  } else res.status(200).json(product);
});

////ADD PRODUCTS//////
app.post("/products", async (req, res) => {
    let productInput = req.body;
    //validations
    const error = ProductUtility.isValidInputProduct(productInput);
    if(error) 
    {
        console.log(error);
        res.status(400).json(error);
        return; 
    }
    const result = await ProductService.addProduct(productInput);
    if(result=="err1")
    {
        res.status(400).json({err : "Duplicate Entry !(Product with similar name already exists)"});
        return;
    }
    else if(result=="err2")
    {
        res.status(400).json({err : "Duplicate Entry !(Product with similar url already exists)"});
        return;
    }
    res.status(201).json(result);

});

////PORT LISTEN/////
app.listen(port, () => {
    console.log(`Product app listening on port ${port}`);
  });


