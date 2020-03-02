//const http = require('http');
const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const app = express();
app.set('view engine', 'ejs');
//app.set('views', 'views');//shall be required if the views folder is not named as "views"
//const adminRoutes=require('./routes/admin');//works for module.exports
const adminRoutes=require('./routes/admin');//
const shopRoutes = require('./routes/shop');
const errorController=require('./controllers/error');
const sequelize = require('./util/database');
const Product=require('./models/product');
const User = require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
//between creating app and creatig server we can add middlewares


/*app.use('/', (req, res, next)=>{
    console.log('This always runs');
    next();
});*/

//bodyparser.urlencoded internally calls the next
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));//makes the public folder statically available to front end

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user=> {
        req.user=user;//not a simple object but a sequelize object hence we can destroy that as well
        next();
    })
    .catch(err=> console.log(err));
});
//can use multipe static folders
//order of admin routes and shop routes matters here if we used app.use in admin and shop routes
app.use('/admin',adminRoutes);//appendes all admin routes with/admin
app.use(shopRoutes);

/*db.execute('select * from products')
.then(result=>{
    console.log(result);
})
.catch(err =>{
    console.log(err)
});*/

//handling all unknown routes because route next funnels from top to bottom

app.use(errorController.get404);


//between creating app and creatig server we can add middlewares
/*const server = http.createServer(app);

server.listen(3000);*/

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});//user created the product, cascading if user deleted
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()//{force: true} force true not to be used in production, used to overwrite alltables
.then(result=>{
   // console.log(result);
   return User.findByPk(1);
    
})
.then(user=> {
    if(!user){
        return User.create({name: 'Rahul', email: 'test@test.com'})
    }

    return user; //same as return Promise.resolve(user)
})
.then(user=>{
    //console.log(user);
    return user.createCart();
    
})
.then(cart=> {
    app.listen(3000);
})
.catch(err =>{
    console.log(err);
});
