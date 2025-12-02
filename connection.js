var mysql=require('mysql');

var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'disha_computers'
});
module.exports=con;