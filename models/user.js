const getDb = require('../util/database').getDb;//acquiring a reference of getDb, to call we shall have to use getDb()
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor (username, email, cart, id){
        this.name=username;
        this.email=email;
        this.cart=cart;
        this._id=id;
    }

    save (){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id: ObjectId(userId)}).next();//find returns a cursor next 
        //returns in this case only one user, findone will not return a cursor
    }

    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(cp=>{//if cart product is -1 means it does not exist
            return cp.productId.toString() ===product._id.toString();
        });

        let newQuantity =1;
        const updatedCartItems = [...this.cart.items];


        if(cartProductIndex>=0){
            newQuantity = this.cart.items[cartProductIndex].quantity+1;
            updatedCartItems[cartProductIndex].quantity =newQuantity;
        }
        else {
            updatedCartItems.push({items: [{productId: new ObjectId(product._id), quantity: newQuantity}]} );
        }
        const db = getDb();
        const updatedCart = {items: updatedCartItems} ;
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
    }
}

module.exports = User;