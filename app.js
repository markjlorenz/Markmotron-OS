// Generated by CoffeeScript 1.6.3
var app, eventUrl, express, http, imap, path, url;

express = require("express");

http = require("http");

path = require("path");

url = require("url");

imap = require("dapple-imap");

app = express();

global.Stackmotron = require("stackmotron-twilio");

global.Markmotron = require("./markmotron");

Markmotron.reload();

app.set("port", process.env.PORT);

app.set("views", __dirname + "/views");

app.set("view engine", "jade");

app.use(express.favicon());

app.use(express.logger("dev"));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(express.cookieParser("your secret here"));

app.use(express.session());

app.use(app.router);

app.use(require("less-middleware")({
  src: __dirname + "/public"
}));

app.use(express["static"](path.join(__dirname, "public")));

if ("development" === app.get("env")) {
  app.use(express.errorHandler());
}

app.post("/reload", function(req, res) {
  Markmotron.reload();
  return res.json({
    status: "reloaded"
  });
});

eventUrl = function(req) {
  var eventPath, reqUrl;
  reqUrl = url.parse(req.url).pathname;
  eventPath = reqUrl.replace(/^\//, '').replace(/\//g, '.');
  if (eventPath) {
    return "." + event;
  } else {
    return "";
  }
};

app.get(/..*/, function(req, res) {
  Markmotron.emit("http.get." + (eventUrl(req)), req);
  return res.json(200, {
    message: "OK"
  });
});

app.post(/..*/, function(req, res) {
  if (!Stackmotron.handle(req)) {
    Markmotron.emit("http.post" + (eventUrl(req)), req);
  }
  return res.json(200, {
    message: "OK"
  });
});

http.createServer(app).listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});

imap.on('mail', function(mailMessage) {
  Markmotron.emit("mail", mailMessage);
  Markmotron.emit("mail.to." + mailMessage.headers.to[0].address, mailMessage);
  Markmotron.emit("mail.from." + mailMessage.headers.from[0].address, mailMessage);
  console.log("mail.to." + mailMessage.headers.to[0].address);
  return console.log("mail.from." + mailMessage.headers.from[0].address);
});