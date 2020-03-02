const mongodb =require('mongodb');
const getDb=require('../util/database').getDb;

class Product {
  constructor(title, price, imageUrl, description){
    this.title=title;
    this.price=price;
    this.imageUrl=imageUrl;
    this.description=description;
  }

  save(){
    const db=getDb();
    return db.collection('products').insertOne(this);
  }

  static fetchAll(){
    const db=getDb();
    return db.collection('products').find().toArray();//find returns a cursor not a promise toArray converts them all to one array
    //and returns a promise
  }

  static findById(prodId){
    const db=getDb();

    return db.collection('products').find({_id:new mongodb.ObjectId(prodId)}).next();
  }
}


module.exports=Product;