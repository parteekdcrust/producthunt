//////CONNECTION WITH MYSQL SERVER//////

const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Parteek.2803',
  database: 'producthuntdb'
});

connection.connect((err) => {
  if (err)
  {
    console.log(err);
    throw err;
  } 
  console.log("Connected to MySQL Server!");
});
const query = util.promisify(connection.query).bind(connection);


////1. GET METHOD//////
let getProductsFromDB = async (id) => {
  let detailedProduct;
  //this will fetch all products details including images and comments and no_of upvotes if any in detailedProduct
  detailedProduct= await query('SELECT p.id,p.name,p.short_desp,p.visit_url,p.icon_url,p.long_desp,created_on,created_by,updated_on,updated_by,GROUP_CONCAT(DISTINCT image.url SEPARATOR ",") AS images, GROUP_CONCAT(DISTINCT comment.desp SEPARATOR ",") AS comments, COUNT(DISTINCT upvote.prod_id) as upvote_count FROM product p left JOIN image ON image.prod_id = p.id left JOIN comment ON comment.prod_id = p.id LEFT JOIN upvote ON upvote.prod_id = p.id GROUP BY p.id');
  //this map function will convert image and comment field value of every product which was earlier a string into array in detailedProduct
  detailedProduct = detailedProduct.map(row => ({
  ...row,
  images: row.images ? row.images.split(','):[],
  comments: row.comments ? row.comments.split(','):[]
  }));
  id=Number(id);
  //this will return result of /product/id
  if(id)
  {
    detailedProduct=detailedProduct.find(ele=>ele.id===id);
    return detailedProduct;
  }
  //this will return result of /products
  else
  {
    let homePageProducts=[];
    detailedProduct.forEach((ele)=>{
    const {id,name,short_desp,icon_url,visit_url,upvote_count,comments}=ele;
    let product={id,name,short_desp,icon_url,visit_url,upvote_count,comments_count:comments.length};
    homePageProducts.push(product);
    });
    return homePageProducts;
  }
};


// {err : "Duplicate Entry !(Product with similar name already exists)"} err1
// {err : "Duplicate Entry !(Product with similar url already exists)"} err2
//get noOfProducts
const getNoOfProductsQuery = `SELECT COUNT(id) as cp FROM product `;

/////2. ADD METHOD//////
let addProductToDB = async (productInput) => {

    //validation for duplicate entry (Business Logic)
    let countOfProductByName = await query(getNoOfProductsQuery + `WHERE name = "${productInput["name"]}" `);
    if(countOfProductByName[0].cp) return "err1";
    let countOfProductByUrl = await query(getNoOfProductsQuery + `WHERE visit_url = "${productInput["visit_url"]}" `);
    if(countOfProductByUrl[0].cp) return "err2";
  
    let userId = Date.now(); ///creating own id's using Date.now() method  
    userId = Math.floor(userId/1000);
  
    let columnQuery="id,";
    let valuesQuery=`${userId},`;
    columnQuery += `name, visit_url,icon_url,long_desp,short_desp,created_by,created_on,updated_by,updated_on`;
    valuesQuery += `"${productInput["name"]}","${productInput["visit_url"]}","${productInput["icon_url"]}","${productInput["long_desp"]}","${productInput["short_desp"]}",${productInput["created_by"]},"${productInput["created_on"]}",${productInput["updated_by"]},"${productInput["updated_on"]}" `;
    
    let defaultSqlQuery = "SELECT * FROM product";
  
    let sqlQuery = `INSERT INTO product (${columnQuery}) VALUES(${valuesQuery}) ` ;
    sqlQuery = productInput ? sqlQuery : defaultSqlQuery;
    let result = await query(sqlQuery);
  
    result["id"]=userId; // adding generated id's in result
    return result;
  };
  

module.exports= { addProductToDB,getProductsFromDB};  