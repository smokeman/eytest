var wechat          = require("wechat");
var express         = require("express");
var logger          = require("morgan");
var errorhandler    = require("errorhandler");
var bodyParser      = require("body-parser");
var fs              = require("fs");
var path            = require("path");
var routes          = require("./routes");
var config          = require("./config");

var app = express();

//config
app.set('port', process.env.PORT || config.host.port);
app.use(logger('combined', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// route
if (app.get('env') === config.host.env) {
    app.get('/weixin', routes.weixinSetup);
} else {
    app.use('/weixin', routes.weixin);
}

// error handler
app.use(errorhandler());

// start up server
app.listen(app.get('port'), function () {
    console.log('Server listening on:', app.get('port'));
});


