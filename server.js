var http = require("http");  //1
var url = require("url");  //2
var express = require("express");
var consolidate = require('consolidate');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();

app.set('views', 'views');
app.set('view engine', 'html');
app.engine('html', consolidate.handlebars);
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
var portNumber = process.env.PORT || 8000;

http.createServer(app).listen(portNumber, function(){
	console.log('Server listening at port '+ portNumber);
	routes.initialize(app);
});