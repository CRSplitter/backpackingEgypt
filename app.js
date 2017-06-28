const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const secret = 'thisismytopsecret'
var tls = require('tls')
var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb://megzz:<PASSWORD>@bpegypt-shard-00-00-tgmxi.mongodb.net:27017,bpegypt-shard-00-01-tgmxi.mongodb.net:27017,bpegypt-shard-00-02-tgmxi.mongodb.net:27017/?ssl=true&replicaSet=bpegypt-shard-0&authSource=admin";
// MongoClient.connect(uri, function(err, db) {
//   db.close();
// });
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://megzzar:Icanfly00@ds145750.mlab.com:45750/bpegypt`);
app.set("port", process.env.PORT || 3000);
app.set('superSecret', secret); // secret variable
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(morgan('dev'));
// app.use(flash());

const routes = require("./routes");
//SERVER ROUTES
// app.use(app.router);
// routes.initialize(app);
// app.use('/',routes);
app.use('/auth', require('./routes/authRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/backpacker', require('./routes/backpackerRoutes'))
// app.listen(app.get("port"), function() {
// console.log("Server started on port " + app.get("port"));
// });
app.listen(process.env.PORT)

module.exports = app
