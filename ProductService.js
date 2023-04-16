const ProductDAO=require('./ProductDAO');
const model = require('./models/product');

let getProducts = async () => {
  return await ProductDAO.getProductsFromDB();
};

let getProductById = async (id) => {
  return await ProductDAO.getProductsFromDB(id);
};

let addProduct = async (productInput) => {

  //extracting values from input body
  let {name,visit_url,icon_url,long_desp,short_desp,created_by,created_on,updated_by,updated_on,comments,upvote,tags}=productInput; //destructuring input json
  const productObject = new model.Product(name,visit_url,icon_url,long_desp,short_desp,created_by,created_on,updated_by,updated_on);

  for(let element of comments)
  {
      const {id,description,created_by}=element;
      productObject.addComments(new model.Comment(id,description,created_by));//adding comments to new product created
  }

  for(let element of tags)
  {
      const {id,name}=element;
      productObject.addTag(new model.Tag(id,name)); //adding tags to new product created
  }
  while(upvote--) productObject.upvote(); //adding upvotes to new product created

  console.log(productObject);
  return await ProductDAO.addProductToDB(productObject);
  };


module.exports={addProduct, getProducts, getProductById};  