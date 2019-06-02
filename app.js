var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var addtodoRouter = require("./routes/addtodo");
var marktodoRouter = require("./routes/marktodo");
var listtodoRouter = require("./routes/listtodo");
var connect = require("./connect");
var config = require("config");

var app = express();

connect();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/marktodo", marktodoRouter);
app.use("/listtodo", listtodoRouter);
app.use("/addtodo", addtodoRouter);

if (!config.get("dbUrl")) {
  console.log("FATAL ERROR, database url string missing");
  process.exit(1);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
