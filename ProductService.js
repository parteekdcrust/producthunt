const ProductDAO=require('./ProductDAO');
const model = require('./models/product');

const convertToClassObject= (productFromDB)=>{
let {id,name,visit_url,icon_url,long_desp,short_desp,created_by,created_on,updated_by,updated_on,comments,upvote_count,images,tags}=productFromDB;//destructuring object from DB
  let productObject = new model.Product(name,visit_url,icon_url,long_desp,short_desp,created_by,updated_by);
  if(comments)
  {
    for(let i=0;i<comments.length;i++)
    {
      const {id,description,created_by}=comments[i];
      productObject.addComments(new model.Comment(id,description,created_by));//adding comments to productObject
    }
  }
  if(images)
  {
    for(let element of images)
    {
      const {id,url}=element;
      productObject.addImages(new model.Image(id,url));//adding images to productObject
    }
  }
  if(tags)
  {
    for(let element of tags)
    { 
      const {id,tag}=element;
      productObject.addTag(new model.Tag(id,tag));//adding tags to productObject
    }
  }
  productObject.id = id;
  productObject.created_on=created_on;
  productObject.updated_on=updated_on;
  while(upvote_count--) productObject.upvote();
  // console.log(productObject);
  return productObject;
}

let getProducts = async () => {
  const productFromDB =  await ProductDAO.getProductsFromDB();
  // console.log(productFromDB);
  let homePageProducts = productFromDB.map((element)=>{
    return convertToClassObject(element);
  });
  console.log(homePageProducts);
  return homePageProducts;
};

let getProductById = async (idp) => {
  let productFromDB =  await ProductDAO.getProductsFromDB(idp);
  // console.log(productFromDB);
  //making class of productFromDB
  const productObject = convertToClassObject(productFromDB);
  return productObject;
};

let addProduct = async (productInput) => {

  //extracting values from input body
  let {name,visit_url,icon_url,long_desp,short_desp,created_by,updated_by,comments,upvote,tags,images}=productInput; //destructuring input json
  const productObject = new model.Product(name,visit_url,icon_url,long_desp,short_desp,created_by,updated_by);

  for(let element of comments)
  {
      const {id,description,created_by}=element;
      productObject.addComments(new model.Comment(id,description,created_by));//adding comments to new product created
  }

  for(let element of tags)
  {
      const {id,tag}=element;
      productObject.addTag(new model.Tag(id,tag)); //adding tags to new product created
  }
  for(let element of images)
  {
    const {id,url}=element;
    productObject.addImages(new model.Image(id,url));//adding images to productObject
  }
  while(upvote--) productObject.upvote(); //adding upvotes to new product created

  console.log(productObject);
  return await ProductDAO.addProductToDB(productObject);
  };


module.exports={addProduct, getProducts, getProductById};  