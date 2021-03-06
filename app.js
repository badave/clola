// Server
var express = require('express');
var http = require('http');
var path = require('path');
var hbs = require('hbs');
var less = require('less-middleware');
var fs = require('fs');
var request = require('request');

var config = require('./config');
var helper = require('./lib/helper');

var hbsTemplates = require('connect-handlebars');

require("./initialize/handlebars");

var app = express();

var db = require('./lib/db');
db.url = config.db_url;

// process.on('uncaughtException', function(err) {
//   console.error("Uncaught Exception: ", err);
//   // process.exit(1);
// });

// heroku router uses x-forwarded-proto to determine https
var redirectFromNaked = function(req, res, next) {
  if (req.host.match(/^(trycelery.com)$/) !== null) {
    res.redirect(301, 'https://www.' + req.host + req.originalUrl);
  } else {
    next();
  }
};

var redirectSubdomains = function(req, res, next) {
  if (req.subdomains && req.subdomains.length === 1) {
    var subdomain = req.subdomains[0];
    if (subdomain === 'developer') {
      var newHost = req.host.replace(subdomain, 'www');
      res.redirect('https://' + newHost + '/' + subdomain);
    } else if (subdomain !== 'www' && subdomain !== 'staging') {
      var newHost = req.host.replace(subdomain, 'www');
      res.redirect('https://' + newHost + '/shop/' + subdomain);
    } else {
      next();
    }
  } else {
    next();
  }
}

var redirectToSecure = function(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect(301, 'https://' + req.host + req.originalUrl);
  } else {
    next();
  }
};

var loadUserCookie = function(req, res, next) {
  var access_token = req.signedCookies.access_token;

  if (access_token) {
    db.findOne("users", {"access_token": access_token}, function(err, user) {
      if (err || !user) {
        return next();
      }

      req.user = user;
      return next();
    });
  } else {
    return next();
  }
};

var loadUserSession = function(req, res, next) {
  res.locals.session = req.session;
  
  next();
};


var unloadMessages = function(req, res, next) {
  if(req.session.success) {
    res.locals.success = req.session.success;
    req.session.success = undefined;
  }
  if(req.session.error) {
    res.locals.error = req.session.error;
    req.session.error = undefined;
  }
  next();
}


//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

// Load config into handlebars
app.use(function(req, res, next) {
  res.locals.config = config;
  res.locals.title = config.title;
  next();
})

// Configure
// All middleware needs to be above the app.router call
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('staging', function() {
  // app.use(redirectFromNaked);
  // app.use(redirectToSecure);
  // app.use(redirectSubdomains);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
})

app.configure('production', function(){
  // app.use(redirectFromNaked);
  // app.use(redirectToSecure);
  // app.use(redirectSubdomains);
  app.use(express.errorHandler()); 
});


app.configure(function (){
  app.use(express.compress());

  app.use(less({
      src: __dirname + '/less',
      dest: __dirname + '/public/css',
      prefix: '/css',
      compress: true,
      force: config.test
  }));

  app.use("/js/templates.js", hbsTemplates(__dirname + "/backbone/modules", {
    exts: ['hbs','handlebars']
  }));

  app.configure('development', function() {
    app.use("/js/app", express.static(path.join(__dirname, 'backbone')));
  });
  var oneDay = 86400000;
  var oneYear = 31536000000;

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'assets'), {maxAge: oneYear}));
  app.use(express.static(path.join(__dirname, 'js')));
  app.use("/js/app", express.static(path.join(__dirname, 'backbone')));


  app.engine('handlebars', require('hbs').__express);
  app.set('port', process.env.PORT || 5050);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'handlebars');
  // app.set('view options', {layout: false});

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('kombucha synergy'));
  app.use(express.cookieSession('kombucha synergy'));
  app.use(allowCrossDomain);
  app.use(loadUserCookie);
  app.use(loadUserSession);
  // app.use(unloadMessages);
  app.use(app.router);
});

// Routes
var routes = require('./routes')(app);

var server = http.createServer(app).listen(app.get('port'), function (){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

var socketController = require('./controllers/socket_controller')(server);
