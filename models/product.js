const mongodb =require('mongodb');
const getDb=require('../util/database').getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId){
    this.title=title;
    this.price=price;
    this.imageUrl=imageUrl;
    this.description=description;
    this._id = id ?  new mongodb.ObjectId(id): null;
    this.userId=userId;
  }

  save(){
    const db=getDb();
    
    if(this._id){
      return db.collection('products').updateOne({_id: this._id}, {$set: this});
    }

    else {
      return db.collection('products').insertOne(this);
    }
    
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

  static deleteById(prodId){
    const db = getDb();
   return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)});
  }
}


module.exports=Product;