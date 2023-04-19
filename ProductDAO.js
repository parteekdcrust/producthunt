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



const modify = (element)=>{
  let arr = element.split("|");
  arr.forEach((currEle,index,arr)=>{
      arr[index] = JSON.parse(currEle);
  });
  return arr;
} 


////1. GET METHOD//////
let getProductsFromDB = async (id) => {
  let detailedProduct;
  //this will fetch all products details including images and comments and no_of upvotes if any in detailedProduct
  detailedProduct= await query(`SELECT 
  p. id,
  p.name,
  p.short_desp,
  p.visit_url,
  p.icon_url,
  p.long_desp,
  p.created_on,
  p.created_by,
  p.updated_on,
  p.updated_by,
  (
      SELECT 
      group_concat(JSON_OBJECT(
                  'id', t.id,
                  'tag', t.tag
              ) separator "| " )
              
          
      FROM 
          tag t
          JOIN product_tag pt ON t.id = pt.tag_id
      WHERE 
          pt.prod_id = p.id
  ) AS tags,
  (
      SELECT 
      group_concat(JSON_OBJECT(
                  'id', i.id,
                  'url', i.url
              ) separator "| ")
              
          
      FROM 
          image i
      WHERE 
          i.prod_id = p.id
  ) AS images,
  (
      SELECT 
      group_concat(JSON_OBJECT(
                  'id', c.id,
                  'description', c.desp,
                  'created_by' , c.user_id
              ) separator "| ")
              
          
      FROM 
          comment c
      WHERE 
          c.prod_id = p.id
  ) AS comments,
  (	
  select
  COUNT(user_id) 
      from upvote u
      where u.prod_id=p.id
  ) as upvote_count 
  FROM 
  product p
order by p.id`);
  // console.log(detailedProduct);
  //this map function will convert image and comment field value of every product which was earlier a string into array in detailedProduct
  detailedProduct = detailedProduct.map(row => ({
  ...row,
  tags: row.tags ? modify(row.tags):[],
  images: row.images ? modify(row.images):[],
  comments: row.comments ? modify(row.comments):[]
  }));
  // console.log(detailedProduct);
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
    const {id,name,short_desp,icon_url,visit_url,upvote_count,comments,created_on,updated_on,tags}=ele;
    let product={id,name,short_desp,icon_url,visit_url,created_on,updated_on,tags,upvote_count,comments_count:comments.length};
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
    try {
      let countOfProductByName = await query(getNoOfProductsQuery + `WHERE name = "${productInput["name"]}" `);
      let countOfProductByUrl = await query(getNoOfProductsQuery + `WHERE visit_url = "${productInput["visit_url"]}" `);
      if(countOfProductByName[0].cp || countOfProductByUrl[0].cp)
      {
        throw new ReferenceError("Duplicate Entry");
      }  
    } catch (error) {
      console.log(error.name,":",error.message);
      return;
    }
    
  
    let userId = Date.now(); ///creating own id's using Date.now() method  
    userId = Math.floor(userId/1000);
    
    let today = new Date();//creating own date and time 
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    
    // console.log(dateTime)

    let columnQuery="id,created_on,updated_on,";
    let valuesQuery=`${userId},"${dateTime}","${dateTime}",`;
    columnQuery += `name, visit_url,icon_url,long_desp,short_desp,created_by,updated_by`;
    valuesQuery += `"${productInput["name"]}","${productInput["visit_url"]}","${productInput["icon_url"]}","${productInput["long_desp"]}","${productInput["short_desp"]}",${productInput["created_by"]},${productInput["updated_by"]}`;
    
    let defaultSqlQuery = "SELECT * FROM product";
  
    let sqlQuery = `INSERT INTO product (${columnQuery}) VALUES(${valuesQuery}) ` ;
    sqlQuery = productInput ? sqlQuery : defaultSqlQuery;
    let result = await query(sqlQuery);
  
    result["id"]=userId; // adding generated id's in result
    return result;
  };
  

module.exports= { addProductToDB,getProductsFromDB};  