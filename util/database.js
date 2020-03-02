const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs-cart', 'root', '5656#rST', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
/*const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodejs-cart',
    password: '5656#rST'
});

module.exports=pool.promise();*/